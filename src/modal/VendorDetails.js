import {Component, h} from 'preact';

import styles from './PreferencesVendorList.scss';
import getCookieAge from './utils/getCookieAge';
import Consented from './utils/isConsented';
import VendorUrls from "./VendorUrls";
import DataCategories from "./DataCategories";
import FindOutMoreLink from "./FindOutMoreLink";

class VendorDetails extends Component {
    static renderVendor(vendor, props, hiddenSections = []) {
        const { content, allPurposes, allPurposesSpecial, allFeatures, allFeaturesSpecial, allDataCategories } = props;

        return (
            <div className={styles.vendorDetails}>
                {vendor.purposes.length > 0 && (
                    <div>
                        <div className={styles.subheader}>
                            {content.purposesHeading}
                        </div>
                        {vendor.purposes.map((purposeId) => (
                            <div className={`${styles.vendorDetail} ${styles.flex}`} key={`${vendor.id}_${purposeId}`}>
                                <span>{allPurposes[purposeId].name} <span className={styles.dayNotification}>({vendor.dataRetention.purposes[purposeId] || vendor.dataRetention.stdRetention} {content.storageDetailsCookieMaxAgeDays})</span></span>
                                {!hiddenSections.includes('purposesStatus') && (
                                    <span className={styles.allowed}>
                                        {Consented.isConsentedVendor(vendor.id, props) && Consented.isConsentedPurpose(purposeId, props) ? content.allowedButton : content.disallowedButton}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {vendor.specialPurposes.length > 0 && (
                    <div>
                        <div className={styles.subheader}>
                            {content.purposesSpecialHeading}
                        </div>
                        {vendor.specialPurposes.map((purposeId) => (
                            <div className={`${styles.vendorDetail} ${styles.flex}`} key={`${vendor.id}_${purposeId}`}>
                                <span>{allPurposesSpecial[purposeId].name} <span className={styles.dayNotification}>({vendor.dataRetention.specialPurposes[purposeId] || vendor.dataRetention.stdRetention} {content.storageDetailsCookieMaxAgeDays})</span></span>
                                <FindOutMoreLink content={content} vendor={vendor} />
                            </div>
                        ))}
                    </div>
                )}
                {vendor.legIntPurposes.length > 0 && (
                    <div>
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
                    <div>
                        <div className={styles.subheader}>
                            {content.purposesFlexibleHeading}
                        </div>
                        {vendor.flexiblePurposes.map((purposeId) => (
                            <div className={`${styles.vendorDetail} ${styles.flex}`} key={`${vendor.id}_${purposeId}`}>
                                <span>{allPurposes[purposeId].name}</span>

                            </div>
                        ))}
                    </div>
                )}
                {vendor.features.length > 0 && (
                    <div>
                        <div className={styles.subheader}>
                            {content.featuresHeading}
                        </div>
                        {vendor.features.map((featureId) => (
                            <div className={styles.vendorDetail} key={`${vendor.id}_${featureId}`}>
                                <div className={styles.flex}>
                                    <span>{allFeatures[featureId].name}</span>
                                    <FindOutMoreLink vendor={vendor} content={content} />
                                </div>
                                <div className={styles.featureDescription}>
                                    {allFeatures[featureId].description}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {vendor.specialFeatures.length > 0 && (
                    <div>
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
                {vendor.urls && (
                    <VendorUrls content={content} vendor={vendor} />
                )}
                <DataCategories content={content} vendor={vendor} dataCategories={allDataCategories} />
                <div>
                    {(vendor.usesNonCookieAccess || vendor.usesCookies) && (
                        <div className={styles.subheader}>
                            {content.storageDetailsHeading}
                        </div>
                    )}
                    {vendor.usesNonCookieAccess && (
                        <div className={styles.vendorDetail}>
                            {content.storageDetailsNonCookieAccessTrue}
                        </div>
                    )}
                    {vendor.usesCookies && vendor.usesNonCookieAccess === false && (
                        <div className={styles.vendorDetail}>
                            {content.storageDetailsNonCookieAccessFalse}
                        </div>
                    )}
                    {vendor.usesCookies && vendor.cookieMaxAgeSeconds !== undefined && vendor.cookieMaxAgeSeconds !== null && (
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
