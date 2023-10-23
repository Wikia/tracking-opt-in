import {Component, h} from "preact";
import styles from "./PreferencesVendorList.scss";
import {getVendorPrivacyLinks} from "./utils/getVendorPrivacyLinks";

class FindOutMoreLink extends Component{
    render({vendor, content}) {
        const vendorPrivacyUrl = getVendorPrivacyLinks(vendor).privacy;
        return (
            <a href={vendorPrivacyUrl} className={styles.link} target="_blank">
                {content.findOutMoreButton}
            </a>
        )
    }
}

export default FindOutMoreLink;
