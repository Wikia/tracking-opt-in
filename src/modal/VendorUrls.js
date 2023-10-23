import styles from "./PreferencesVendorList.scss";
import {Component, h} from 'preact';
import {getVendorPrivacyLinks} from "./utils/getVendorPrivacyLinks";

class VendorUrls extends Component {
    render({content, vendor}) {
        const urls = getVendorPrivacyLinks(vendor);
        return (<div>
            <div>
                <div className={styles.subheader}>
                    {content.privacyPolicyHeading}
                </div>
                <div className={styles.vendorDetail}>
                    <a href={urls.privacy} className={styles.link} target="_blank">
                        {content.privacyPolicyLinkButton}
                    </a>
                </div>
            </div>
            {urls.legIntClaim && (
                <div>
                    <div className={styles.subheader}>
                        {content.legitimateInterestsHeading}
                    </div>
                    <div className={styles.vendorDetail}>
                        <a href={urls.legIntClaim} className={styles.link} target="_blank">
                            {content.legitimateInterestsLinkButton}
                        </a>
                    </div>
                </div>
            )}
        </div>)
    }
}

export default VendorUrls;
