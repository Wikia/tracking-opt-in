import { CmpApi } from '@iabgpp/cmpapi';
import { debug, getCookieDomain } from "../shared/utils";
import Cookies from "js-cookie";

const NOTICE_FIELDS = {
	'uscav1': ['SaleOptOutNotice', 'SharingOptOutNotice', 'SensitiveDataLimitUseNotice'],
	'uscov1': ['SharingNotice', 'SaleOptOutNotice', 'TargetedAdvertisingOptOutNotice'],
	'usctv1': ['SharingNotice', 'SaleOptOutNotice', 'TargetedAdvertisingOptOutNotice'],
	'usutv1': ['SharingNotice', 'SaleOptOutNotice', 'TargetedAdvertisingOptOutNotice', 'SensitiveDataProcessingOptOutNotice'],
	'usvav1': ['SharingNotice', 'SaleOptOutNotice', 'TargetedAdvertisingOptOutNotice'],
}
const OPT_OUT_FIELDS = {
	'uscav1': ['SaleOptOut', 'SharingOptOut'],
	'uscov1': ['SaleOptOut', 'TargetedAdvertisingOptOut'],
	'usctv1': ['SaleOptOut', 'TargetedAdvertisingOptOut'],
	'usutv1': ['SaleOptOut', 'TargetedAdvertisingOptOut'],
	'usvav1': ['SaleOptOut', 'TargetedAdvertisingOptOut'],
}
const SENSITIVE_DATA_PROCESSING_LENGTH_FIELD = 'SensitiveDataProcessing'
const SENSITIVE_DATA_PROCESSING_LENGTHS = {
	'uscav1': 9,
	'uscov1': 7,
	'usctv1': 8,
	'usutv1': 8,
	'usvav1': 8,
}
const KNOWN_CHILD_SENSIITIVE_DATA_FIELD = 'KnownChildSensitiveDataConsents'
const KNOWN_CHILD_SENSIITIVE_DATA_LENGTHS = {
	'uscav1': 2,
	'usctv1': 3,
}  // NOTE: no length = single int
const US_MSPA_FIELDS = ['MspaCoveredTransaction', 'MspaOptOutOptionMode', 'MspaServiceProviderMode']

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

const GPP_STRING_COOKIE_NAME = 'gpp'


class GppManager {
	// TODO extract all consts and setting fields to separate file?

	constructor(options) {
		this.cmpApi = new CmpApi(1, 3);
		this.section = `us${options.region}v1`;
		this.gppApplies = options.gppApplies;
		this.isSubjectToGPP = options.isSubjectToGPP;
		this.cookieAttributes = {
			domain: getCookieDomain(window.location.hostname),
			expires: 365 // 1 year
		};
	}

	setup() {
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
				this.setGppString(CONSENT_VALUES.optOut);
				debug('GPP', 'Privacy String updated via URL parameter');
			} else if (this.isSubjectToGPP) {
				this.setGppString(CONSENT_VALUES.optOut);
				debug('GPP', 'Force opt-out because user is subject to COPPA');
			} else if (navigator.globalPrivacyControl) {
				this.setGppString(CONSENT_VALUES.optOut);
				debug('GPP', 'Force opt-out because Global Privacy Control is detected');
			} else if (this.getGppStringCookie()) {
				try {
					this.cmpApi.setGppString(this.getGppStringCookie());
				} catch (err) {
					// opt out the user when cookie is invalid
					this.setGppString(CONSENT_VALUES.optOut);
				}
			} {
				this.setGppString(CONSENT_VALUES.consent);
			}
		}
		this.setGppStringCookie();
	}

	getGppStringCookie() {
		return Cookies.get(GPP_STRING_COOKIE_NAME) || '';
	}

	setGppStringCookie() {
		Cookies.set(GPP_STRING_COOKIE_NAME, this.cmpApi.getGppString(), this.cookieAttributes);
	}

	setGppString(value = 1) {
		this.setNotices(this.section);
		this.setMSPA(this.section);
		this.setConsents(this.section, value);
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

	setMSPA(section) {
		// TODO decide what has to be set here
		US_MSPA_FIELDS.forEach((fieldName) => {
			this.cmpApi.setFieldValue(section, fieldName, MSPA_FIELDS_VALUES.yes);
		});
	}
}

export default GppManager;
