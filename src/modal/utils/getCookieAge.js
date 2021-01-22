function getCookieAge(cookieMaxAgeSeconds, content) {
    if (cookieMaxAgeSeconds <= 0) {
        return content.storageDetailsCookieMaxAgeImmediately;
    } else if (cookieMaxAgeSeconds > 0 && cookieMaxAgeSeconds <= 60) {
        return `${cookieMaxAgeSeconds} ${content.storageDetailsCookieMaxAgeSeconds}`;
    } else if (cookieMaxAgeSeconds > 60 && cookieMaxAgeSeconds <= 3600) {
        return `${Math.round(cookieMaxAgeSeconds / 60)} ${content.storageDetailsCookieMaxAgeMinutes}`;
    } else if (cookieMaxAgeSeconds > 3600 && cookieMaxAgeSeconds <= 86400) {
        return `${Math.round(cookieMaxAgeSeconds / 3600)} ${content.storageDetailsCookieMaxAgeHours}`;
    } else if (cookieMaxAgeSeconds > 86400) {
        return `${Math.round(cookieMaxAgeSeconds / 86400)} ${content.storageDetailsCookieMaxAgeDays}`;
    }

    return '-';
}

export default getCookieAge;
