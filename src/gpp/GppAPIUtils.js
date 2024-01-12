export const NOTICE_FIELDS = {
	'uscav1': ['SaleOptOutNotice', 'SharingOptOutNotice', 'SensitiveDataLimitUseNotice'],
	'uscov1': ['SharingNotice', 'SaleOptOutNotice', 'TargetedAdvertisingOptOutNotice'],
	'usctv1': ['SharingNotice', 'SaleOptOutNotice', 'TargetedAdvertisingOptOutNotice'],
	'usutv1': ['SharingNotice', 'SaleOptOutNotice', 'TargetedAdvertisingOptOutNotice', 'SensitiveDataProcessingOptOutNotice'],
	'usvav1': ['SharingNotice', 'SaleOptOutNotice', 'TargetedAdvertisingOptOutNotice'],
}
export const OPT_OUT_FIELDS = {
	'uscav1': ['SaleOptOut', 'SharingOptOut'],
	'uscov1': ['SaleOptOut', 'TargetedAdvertisingOptOut'],
	'usctv1': ['SaleOptOut', 'TargetedAdvertisingOptOut'],
	'usutv1': ['SaleOptOut', 'TargetedAdvertisingOptOut'],
	'usvav1': ['SaleOptOut', 'TargetedAdvertisingOptOut'],
}
export const SENSITIVE_DATA_PROCESSING_LENGTH_FIELD = 'SensitiveDataProcessing'
export const SENSITIVE_DATA_PROCESSING_LENGTHS = {
	'uscav1': 9,
	'uscov1': 7,
	'usctv1': 8,
	'usutv1': 8,
	'usvav1': 8,
}
export const KNOWN_CHILD_SENSIITIVE_DATA_FIELD = 'KnownChildSensitiveDataConsents'
export const KNOWN_CHILD_SENSIITIVE_DATA_LENGTHS = {
	'uscav1': 2,
	'usctv1': 3,
}  // NOTE: no length = single int
export const US_MSPA_FIELDS = ['MspaCoveredTransaction', 'MspaOptOutOptionMode', 'MspaServiceProviderMode']
