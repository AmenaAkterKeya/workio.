$(document).ready(function () {
    const mobileScreen = window.matchMedia("(max-width: 990px)");

    $(".dashboard-nav-dropdown-toggle").click(function () {
        const $dropdown = $(this).closest(".dashboard-nav-dropdown");
        
        // Toggle current dropdown
        $dropdown.toggleClass("show");
        
        // Hide other dropdowns
        $dropdown.siblings().removeClass("show");
    });

    $(".menu-toggle").click(function () {
        if (mobileScreen.matches) {
            // Toggle navigation visibility on mobile
            $(".dashboard-nav").toggleClass("mobile-show");
        } else {
            // Toggle compact mode for larger screens
            $(".dashboard").toggleClass("dashboard-compact");
        }
    });
});

