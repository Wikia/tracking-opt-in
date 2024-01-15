import { CmpApi, CmpStatus, SignalStatus } from '@iabgpp/cmpapi';
import { debug, getCookieDomain } from '../shared/utils';
import { loadStub } from './stub/GppStub';
import {
	NOTICE_FIELDS,
	OPT_OUT_FIELDS,
	SENSITIVE_DATA_PROCESSING_LENGTH_FIELD,
	SENSITIVE_DATA_PROCESSING_LENGTHS,
	KNOWN_CHILD_SENSIITIVE_DATA_FIELD,
	KNOWN_CHILD_SENSIITIVE_DATA_LENGTHS,
	US_MSPA_FIELDS
} from './GppAPIUtils'
import Cookies from "js-cookie";

const GPP_STRING_COOKIE_NAME = 'gpp'
const CONSENT_VALUES = {
	notApplicable: 0,
	optOut: 1,  // opt-out or no consent
	consent: 2,  // no opt-out or consent
}
const NOTICE_VALUES = {
	notApplicable: 0,
	provided: 1,
	notProvided: 2,
}
const MSPA_FIELDS_VALUES = {
	notApplicable: 0,
	yes: 1,
	no: 2,
}

class GppManager {

	constructor(options) {
		this.section = `us${options.region}v1`;
		this.gppApplies = options.gppApplies;
		this.isSubjectToGPP = options.isSubjectToGPP;
		this.cookieAttributes = {
			domain: getCookieDomain(window.location.hostname),
			expires: 365 // 1 year
		};

		// Install temporary stub until full CMP will be ready
		if (typeof window.__gpp === 'undefined') {
			GppManager.installStub();
		}
	}

	static installStub() {
		loadStub();
	}

	setup() {
		this.cmpApi = new CmpApi(1, 3);
		this.cmpApi.setSupportedAPIs([
			"8:uscav1",
			"9:usvav1",
			"10:uscov1",
			"11:usutv1",
			"12:usctv1",
		]);
		this.cmpApi.setApplicableSections([8, 9, 10, 11, 12]);
		this.cmpApi.setCmpStatus(CmpStatus.LOADED);

		this.setSignal();
	}

	setSignal() {
		if (!this.gppApplies) {
			debug('GPP', 'Geo does not require API');
		} else {
			debug('GPP', 'Geo requires API');

			const queryStringOverride =
				window &&
				window.location &&
				window.location.search &&
				window.location.search.includes('optOutSale=true');

			if (queryStringOverride) {
				this.setGppSection(CONSENT_VALUES.optOut);
				debug('GPP', 'Privacy String updated via URL parameter');
			} else if (this.isSubjectToGPP) {
				this.setGppSection(CONSENT_VALUES.optOut);
				debug('GPP', 'Force opt-out because user is subject to COPPA');
			} else if (navigator.globalPrivacyControl) {
				this.setGppSection(CONSENT_VALUES.optOut);
				debug('GPP', 'Force opt-out because Global Privacy Control is detected');
			} else if (this.cmpApi.hasSection(this.section)) {
				this.cmpApi.setSignalStatus(SignalStatus.READY);
				this.setGppCookie();  // note: to be sure the cookie matches API
			} else {
				this.setGppSection(CONSENT_VALUES.consent);
			}
		}
	}

	setGppCookie() {
		Cookies.set(GPP_STRING_COOKIE_NAME, this.cmpApi.getGppString(), this.cookieAttributes);
	}

	setGppSection(consentValue = CONSENT_VALUES.optOut) {
		this.cmpApi.setSignalStatus(SignalStatus.NOT_READY);
		this.setNotices(this.section);
		this.setMSPAFields(this.section);
		this.setConsents(this.section, consentValue);
		this.cmpApi.fireSectionChange(this.section);
		this.cmpApi.setSignalStatus(SignalStatus.READY);
		this.setGppCookie();
	}

	setConsents(section, value) {
		OPT_OUT_FIELDS[section].forEach((fieldName) => {
			this.cmpApi.setFieldValue(section, fieldName, value);
		});
		this.cmpApi.setFieldValue(
			section,
			SENSITIVE_DATA_PROCESSING_LENGTH_FIELD,
			Array.from(
				{ length: SENSITIVE_DATA_PROCESSING_LENGTHS[section] },
				() => value
			)
		);
		this.setChildSensitiveField(section, value)
	}

	setChildSensitiveField(section, value) {
		if (KNOWN_CHILD_SENSIITIVE_DATA_LENGTHS[section]) {
			this.cmpApi.setFieldValue(
				section,
				KNOWN_CHILD_SENSIITIVE_DATA_FIELD,
				Array.from(
					{ length: KNOWN_CHILD_SENSIITIVE_DATA_LENGTHS[section] },
					() => value
				)
			);
		} else {
			this.cmpApi.setFieldValue(section, KNOWN_CHILD_SENSIITIVE_DATA_FIELD, value);
		}
	}

	setNotices(section) {
		NOTICE_FIELDS[section].forEach((fieldName) => {
			this.cmpApi.setFieldValue(section, fieldName, NOTICE_VALUES.provided);
		});
	}

	setMSPAFields(section) {
		// TODO decide what has to be set here - TACO-355
		US_MSPA_FIELDS.forEach((fieldName) => {
			this.cmpApi.setFieldValue(section, fieldName, MSPA_FIELDS_VALUES.yes);
		});
	}
}

export default GppManager;
