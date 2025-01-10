# YouTube View and Duration Filter

## Description

This UserScript hides YouTube videos that have fewer views or are shorter than a specified duration. It works across various YouTube pages, including search results, channel pages, subscription feeds, home page, and more.

## Features

- Configurable minimum view count and video duration.
- Hides videos with fewer views or shorter duration than the specified values.
- Works on various YouTube pages and sections.
- Smooth transitions for hidden videos.

## Installation

1. Install a UserScript manager extension for your browser (e.g., Violentmonkey, Tampermonkey, Greasemonkey).
2. Click on the following link to install the UserScript: [YouTube View and Duration Filter](https://github.com/or1n/YouTube-View-and-Duration-Filter/raw/main/YouTube%20View%20and%20Duration%20Filter.js).
3. Set your desired minimum view count and duration in the script (default is 10,000 views and 240 seconds).

## Configuration

To change the minimum view count and video duration, edit the `MIN_VIEWS` and `MIN_DURATION_SECONDS` constants in the script:

```javascript
const MIN_VIEWS = 10000; // Set your minimum view count here
const MIN_DURATION_SECONDS = 240; // Set your minimum duration here
