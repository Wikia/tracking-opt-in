import {getBrowserLang} from "../../shared/LangManager";

export function getVendorPrivacyLinks(vendor) {
    return (vendor.urls.find(link => link.langId === getBrowserLang()) ||
            vendor.urls.find(link => link.langId === 'en') ||
            vendor.urls[0])
}
