# YouTube View and Duration Filter

## Description

This UserScript hides YouTube videos that have fewer views or are shorter than a specified duration. It works across various YouTube pages, including search results, channel pages, subscription feeds, home page, and more.

## Features

- Configurable minimum view count and video duration.
- Hides videos with fewer views or shorter duration than the specified values.
- Replaces hidden videos with the next available video.
- Works on various YouTube pages and sections.
- Smooth transitions for hidden videos.

## Comparison

Without the filter, you can see low view and short duration videos. With the filter enabled, those videos are filtered out, and the next available video is shown.

<div style="display: flex; gap: 20px;">
  <div style="flex: 1;">
    <p>With no filter:</p>
    <img src="https://github.com/user-attachments/assets/a6f371cb-d533-4e7b-9eff-ebd447b8ae90" alt="YouTube-View-and-Duration-Filter(disabled)" style="max-width: 100%;">
  </div>
  <div style="flex: 1;">
    <p>With the filter:</p>
    <img src="https://github.com/user-attachments/assets/f2ee2390-79a2-425c-892e-f404053d9b69" alt="YouTube-View-and-Duration-Filter(enabled)" style="max-width: 100%;">
  </div>
</div>

## Installation

1. Install a UserScript manager extension for your browser (e.g., Violentmonkey, Tampermonkey, Greasemonkey).
2. Click on the following link to install the UserScript: [YouTube View and Duration Filter](https://github.com/or1n/YouTube-View-and-Duration-Filter/raw/main/YouTube%20View%20and%20Duration%20Filter.js).
3. Set your desired minimum view count and duration in the script (default is 10,000 views and 240 seconds).

## Configuration

To change the minimum view count and video duration, edit the `MIN_VIEWS` and `MIN_DURATION_SECONDS` constants in the script:

```javascript
const MIN_VIEWS = 10000; // Set your minimum view count here
const MIN_DURATION_SECONDS = 240; // Set your minimum duration here
```

## How It Works

The script uses the following logic to filter videos:

1. **Parse View Count**: It parses the view count from the video metadata.
2. **Convert Duration**: It converts the video duration from YouTube's time format to seconds.
3. **Filter Videos**: It checks if the video meets the minimum view count and duration criteria. If not, the video is hidden and replaced with the next available video.
4. **Dynamic Content Handling**: It uses a MutationObserver to handle dynamic content loading on YouTube pages, ensuring that newly loaded videos are also filtered.

## Debugging

If you want to enable debugging to see console logs for filtered videos, set the `DEBUG` constant to `true` in the script:

```javascript
const DEBUG = true; // Enable console logging for debugging
```
