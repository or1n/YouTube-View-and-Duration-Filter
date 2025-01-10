// ==UserScript==
// @name         YouTube View and Duration Filter
// @namespace    https://github.com/or1n/YouTube-Filter
// @version      1.0
// @description  Hides YouTube videos with fewer views or shorter duration than specified
// @author       https://github.com/or1n
// @license      MIT
// @homepage     https://github.com/or1n/YouTube-View-and-Duration-Filter
// @supportURL   https://github.com/or1n/YouTube-View-and-Duration-Filter/issues
// @updateURL    https://raw.githubusercontent.com/or1n/YouTube-View-and-Duration-Filter/main/YouTube%20View%20and%20Duration%20Filter.js
// @downloadURL  https://raw.githubusercontent.com/or1n/YouTube-View-and-Duration-Filter/main/YouTube%20View%20and%20Duration%20Filter.js
// @match        *://*.youtube.com/*
// @match        http://*.youtube.com/*
// @match        http://youtube.com/*
// @match        https://*.youtube.com/*
// @match        https://youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const MIN_VIEWS = 10000; // Minimum view count
    const MIN_DURATION_SECONDS = 240; // 4 minutes minimum
    const PROCESS_DELAY = 50; // Delay between processing attempts in milliseconds
    const DEBUG = false; // Set to true to enable console logging

    // Helper function to parse view counts with unit multipliers
    function parseViewCount(text) {
        if (!text) return 0;

        const match = text.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*([KMB]?)/i);
        if (!match) return 0;

        let [, count, multiplier] = match;
        count = parseFloat(count.replace(/,/g, ''));

        const multipliers = {
            'K': 1000,
            'M': 1000000,
            'B': 1000000000
        };

        return count * (multipliers[multiplier.toUpperCase()] || 1);
    }

    // Helper function to convert YouTube time format to seconds
    function timeToSeconds(time) {
        if (!time) return 0;

        const parts = time.split(':').reverse();
        let seconds = 0;

        for (let i = 0; i < parts.length; i++) {
            seconds += parseInt(parts[i], 10) * Math.pow(60, i);
        }

        return seconds;
    }

    // Function to check if a video should be filtered based on views and duration
    function isBadVideo(video) {
        const videoViews = video.querySelector('.inline-metadata-item.style-scope.ytd-video-meta-block');
        const durationElement = video.querySelector('span#text.ytd-thumbnail-overlay-time-status-renderer, span.ytd-video-duration-renderer');

        if (!videoViews || !durationElement) return false;

        const viewCount = parseViewCount(videoViews.innerText);
        const duration = durationElement.textContent.trim();
        const seconds = timeToSeconds(duration);

        const isBad = viewCount < MIN_VIEWS || seconds < MIN_DURATION_SECONDS;

        if (isBad && DEBUG) {
            console.log(`Filtered Video: '${videoViews.innerText}' (${viewCount} views, ${seconds} seconds)`);
        }

        return isBad;
    }

    // Function to filter videos
    function filterVideos() {
        // Skip processing on channel and subscription pages
        if (location.pathname.startsWith('/@') ||
            location.pathname.startsWith('/feed/subscriptions')) {
            return;
        }

        // Filter videos from the right side
        const sideVideos = document.getElementsByClassName('style-scope ytd-compact-video-renderer');
        for (const video of sideVideos) {
            if (isBadVideo(video)) {
                video.parentElement.remove();
            }
        }

        // Filter videos from the main page
        const mainVideos = document.getElementsByClassName('style-scope ytd-rich-item-renderer');
        for (const video of mainVideos) {
            if (video.id !== 'content') continue;

            if (isBadVideo(video)) {
                video.parentElement.remove();
            }
        }

        // Filter shorts
        if (location.pathname.startsWith('/shorts')) {
            const shortsVideos = document.getElementsByClassName('reel-video-in-sequence style-scope ytd-shorts');
            for (const video of shortsVideos) {
                if (!video.isActive) continue;

                if (isBadVideo(video)) {
                    const nextButton = document.querySelector('.navigation-button.style-scope.ytd-shorts');
                    if (nextButton) {
                        const buttonFill = nextButton.querySelector('.yt-spec-touch-feedback-shape__fill');
                        if (buttonFill) buttonFill.click();
                    }
                }
            }
        }
    }

    // Create observer for dynamic content
    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldProcess = true;
                break;
            }
        }

        if (shouldProcess) {
            filterVideos();
        }
    });

    // Start observing with specific targets
    function startObserving() {
        const targets = [
            document.querySelector('#content'),
            document.querySelector('#contents'),
            document.querySelector('#items'),
            document.querySelector('#secondary'),
            document.querySelector('#dismissible')
        ].filter(Boolean);

        if (targets.length === 0) {
            setTimeout(startObserving, 1000);
            return;
        }

        targets.forEach(target => {
            observer.observe(target, {
                childList: true,
                subtree: true
            });
        });
    }

    // Initialize the script
    function initialize() {
        const style = document.createElement('style');
        style.textContent = `
            ytd-video-renderer, ytd-grid-video-renderer,
            ytd-rich-item-renderer, ytd-compact-video-renderer {
                transition: opacity 0.3s ease-out;
            }
        `;
        document.head.appendChild(style);

        startObserving();
        filterVideos();
    }

    // Run on page load and navigation
    initialize();

    // Add event listeners for YouTube navigation
    const events = ['yt-navigate-finish', 'yt-page-data-updated', 'load', 'scrollend'];
    events.forEach(event => window.addEventListener(event, filterVideos));
})();
