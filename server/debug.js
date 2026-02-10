console.log("Starting debug");
try {
    require('express');
    console.log("Express loaded");
} catch (e) {
    console.error("Failed to load express:", e.message);
}
