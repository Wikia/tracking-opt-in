import { h, Component } from 'preact';

import styles from './PreferencesVendorList.scss';
import getCookieAge from './utils/getCookieAge';
import Consented from './utils/isConsented';

class VendorDetails {
    static renderVendor(vendor, props) {
        const { content, allPurposes, allPurposesSpecial, allFeatures, allFeaturesSpecial } = props;

        return (
            <div className={styles.vendorDetails}>
                {vendor.purposes.length > 0 && (
                    <div>{/* fragment */}
                        <div className={styles.subheader}>
                            {content.purposesHeading}
                        </div>
                        {vendor.purposes.map((purposeId) => (
                            <div className={`${styles.vendorDetail} ${styles.flex}`} key={`${vendor.id}_${purposeId}`}>
                                <span>{allPurposes[purposeId].name}</span>
                                <span classname={styles.allowed}>
                                    {Consented.isConsentedVendor(vendor.id, props) && Consented.isConsentedPurpose(purposeId, props) ? content.allowedButton : content.disallowedButton}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
                {vendor.specialPurposes.length > 0 && (
                    <div>{/* fragment */}
                        <div className={styles.subheader}>
                            {content.purposesSpecialHeading}
                        </div>
                        {vendor.specialPurposes.map((purposeId) => (
                            <div className={`${styles.vendorDetail} ${styles.flex}`} key={`${vendor.id}_${purposeId}`}>
                                <span>{allPurposesSpecial[purposeId].name}</span>
                                <a href={vendor.policyUrl} className={styles.link} target="_blank">
                                    {content.findOutMoreButton}
                                </a>
                            </div>
                        ))}
                    </div>
                )}
                {vendor.legIntPurposes.length > 0 && (
                    <div>{/* fragment */}
                        <div className={styles.subheader}>
                            {content.purposesLegitimateInterestHeading}
                        </div>
                        {vendor.legIntPurposes.map((purposeId) => (
                            <div className={`${styles.vendorDetail} ${styles.flex}`} key={`${vendor.id}_${purposeId}`}>
                                <span>{allPurposes[purposeId].name}</span>
                                <a href={vendor.policyUrl} className={styles.link} target="_blank">
                                    {content.findOutMoreButton}
                                </a>
                            </div>
                        ))}
                    </div>
                )}
                {vendor.flexiblePurposes.length > 0 && (
                    <div>{/* fragment */}
                        <div className={styles.subheader}>
                            {content.purposesFlexibleHeading}
                        </div>
                        {vendor.flexiblePurposes.map((purposeId) => (
                            <div className={`${styles.vendorDetail} ${styles.flex}`} key={`${vendor.id}_${purposeId}`}>
                                <span>{allPurposes[purposeId].name}</span>
                                <a href={vendor.policyUrl} className={styles.link} target="_blank">
                                    {content.findOutMoreButton}
                                </a>
                            </div>
                        ))}
                    </div>
                )}
                {vendor.features.length > 0 && (
                    <div>{/* fragment */}
                        <div className={styles.subheader}>
                            {content.featuresHeading}
                        </div>
                        {vendor.features.map((featureId) => (
                            <div className={styles.vendorDetail} key={`${vendor.id}_${featureId}`}>
                                <div className={styles.flex}>
                                    <span>{allFeatures[featureId].name}</span>
                                    <a href={vendor.policyUrl} className={styles.link} target="_blank">
                                        {content.findOutMoreButton}
                                    </a>
                                </div>
                                <div className={styles.featureDescription}>
                                    {allFeatures[featureId].descriptionLegal}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {vendor.specialFeatures.length > 0 && (
                    <div>{/* fragment */}
                        <div className={styles.subheader}>
                            {content.featuresSpecialHeading}
                        </div>
                        {vendor.specialFeatures.map((featureId) => (
                            <div className={styles.vendorDetail} key={`${vendor.id}_${featureId}`}>
                                <div className={styles.flex}>
                                    <span>{allFeaturesSpecial[featureId].name}</span>
                                    <span className={styles.allowed}>
                                    {Consented.isConsentedSpecialFeature(featureId, props) ? content.allowedButton : content.disallowedButton}
                                </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {vendor.policyUrl && (
                    <div>{/* fragment */}
                        <div className={styles.subheader}>
                            {content.privacyPolicyHeading}
                        </div>
                        <div className={styles.vendorDetail}>
                            <a href={vendor.policyUrl} className={styles.link} target="_blank">
                                {content.privacyPolicyLinkButton}
                            </a>
                        </div>
                    </div>
                )}
                <div>{/* fragment */}
                    <div className={styles.subheader}>
                        {content.storageDetailsHeading}
                    </div>
                    {vendor.usesNonCookieAccess !== undefined && (
                        <div className={styles.vendorDetail}>
                            {vendor.usesNonCookieAccess ? content.storageDetailsNonCookieAccessTrue : content.storageDetailsNonCookieAccessFalse}
                        </div>
                    )}
                    {vendor.cookieMaxAgeSeconds !== undefined && (
                        <div className={styles.vendorDetail}>
                            {content.storageDetailsCookieMaxAge} {getCookieAge(vendor.cookieMaxAgeSeconds, content)}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default VendorDetails;
