class Consented {
    static isConsentedPurpose(purposeId, props) {
        return props.consentedPurposes.includes(purposeId);
    }

    static isConsentedSpecialFeature(specialFeatureId, props) {
        return props.consentedSpecialFeatures.includes(specialFeatureId);
    }

    static isConsentedVendor(vendorId, props) {
        return props.consentedVendors.includes(vendorId);
    }

    static isConsentedProvider(providerId, props) {
        return props.consentedProviders.includes(providerId);
    }
}

export default Consented;
