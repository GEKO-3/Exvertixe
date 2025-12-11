// Sample data for initial testing
// This file provides example data structure for packages and promotions
// Use this as a reference when adding data through the admin panel

const samplePackages = [
    {
        name: "Starter Package",
        price: 499,
        description: "Perfect for small businesses starting their marketing journey",
        features: [
            "Social Media Management (2 platforms)",
            "8 Posts per month",
            "Basic Analytics Dashboard",
            "Monthly Performance Report",
            "Email Support",
            "Content Calendar Planning"
        ],
        imageUrl: null, // Upload through admin panel
        featured: false,
        active: true
    },
    {
        name: "Professional Package",
        price: 999,
        description: "Comprehensive marketing solution for growing businesses",
        features: [
            "Social Media Management (4 platforms)",
            "16 Posts per month",
            "Advanced Analytics & Insights",
            "Paid Ad Campaign Management ($500 ad spend included)",
            "SEO Optimization (5 pages)",
            "Bi-weekly Strategy Calls",
            "Priority Email & Phone Support",
            "Competitor Analysis Report"
        ],
        imageUrl: null,
        featured: true,
        active: true
    },
    {
        name: "Enterprise Package",
        price: 1999,
        description: "Full-service marketing solution for established brands",
        features: [
            "Social Media Management (All major platforms)",
            "Unlimited Posts & Stories",
            "Comprehensive Analytics Dashboard",
            "Multi-channel Ad Campaigns ($1500 ad spend included)",
            "Advanced SEO & Content Strategy",
            "Weekly Strategy & Planning Sessions",
            "Dedicated Account Manager",
            "24/7 Support Access",
            "Influencer Collaboration Management",
            "Video Content Creation (2 per month)",
            "Email Marketing Campaigns"
        ],
        imageUrl: null,
        featured: false,
        active: true
    },
    {
        name: "Social Media Only",
        price: 299,
        description: "Focused social media management for budget-conscious businesses",
        features: [
            "1 Social Media Platform",
            "4 Posts per month",
            "Basic Scheduling",
            "Monthly Metrics Report",
            "Email Support"
        ],
        imageUrl: null,
        featured: false,
        active: true
    },
    {
        name: "Content Creation Bundle",
        price: 799,
        description: "High-quality content creation for your brand",
        features: [
            "12 Custom Graphics per month",
            "4 Video Reels or TikToks",
            "Copywriting for all content",
            "Brand-aligned design",
            "Unlimited revisions",
            "Content rights included"
        ],
        imageUrl: null,
        featured: false,
        active: true
    }
];

const samplePromotions = [
    {
        title: "Launch Special - 25% Off First 3 Months",
        description: "Celebrate our launch with an exclusive discount! Get 25% off any package for your first three months. Perfect time to elevate your brand presence.",
        discount: "25% OFF",
        originalPrice: 999,
        discountedPrice: 749,
        validUntil: "2025-03-31",
        imageUrl: null,
        active: true
    },
    {
        title: "Annual Commitment Bonus",
        description: "Commit to a full year and receive 2 months absolutely free! Save big while securing long-term marketing success for your business.",
        discount: "2 Months Free",
        originalPrice: null,
        discountedPrice: null,
        validUntil: "2025-12-31",
        imageUrl: null,
        active: true
    },
    {
        title: "Referral Program",
        description: "Refer a business and both of you get $100 credit! There's no limit to how many businesses you can refer. Share the success!",
        discount: "$100 Credit",
        originalPrice: null,
        discountedPrice: null,
        validUntil: "2025-12-31",
        imageUrl: null,
        active: true
    },
    {
        title: "Bundle & Save",
        description: "Subscribe to any two packages and save 15% on the total price. Perfect for businesses needing comprehensive coverage.",
        discount: "15% Bundle",
        originalPrice: null,
        discountedPrice: null,
        validUntil: "2025-06-30",
        imageUrl: null,
        active: true
    }
];

// Service categories for the homepage services section
const serviceCategories = [
    {
        icon: "📱",
        title: "Social Media Marketing",
        description: "Strategic content creation and management across all major platforms to build your online presence"
    },
    {
        icon: "🎯",
        title: "Targeted Advertising",
        description: "Data-driven ad campaigns that reach your ideal customers with precision targeting and optimization"
    },
    {
        icon: "📊",
        title: "Analytics & Reporting",
        description: "Detailed insights and performance metrics for informed business decisions and strategy refinement"
    },
    {
        icon: "✍️",
        title: "Content Creation",
        description: "Engaging, brand-aligned content that resonates with your target audience and drives engagement"
    },
    {
        icon: "🔍",
        title: "SEO Optimization",
        description: "Improve your search rankings and organic visibility to attract more qualified traffic"
    },
    {
        icon: "💼",
        title: "Brand Strategy",
        description: "Comprehensive brand development, positioning, and strategy to differentiate your business"
    }
];

// Sample contact form submission (for testing)
const sampleContact = {
    name: "John Smith",
    email: "john.smith@example.com",
    company: "Smith Enterprises",
    message: "I'm interested in the Professional Package for my growing e-commerce business. Can we schedule a call to discuss customization options?",
    status: "new",
    timestamp: new Date().toISOString()
};

// Sample subscription (structure reference)
const sampleSubscription = {
    userId: "user_uid_here",
    packageId: "package_id_here",
    promotionId: null, // or promotion_id if applicable
    status: "active", // "active", "cancelled", "pending"
    startDate: new Date(),
    endDate: null,
    minimumMonths: 6,
    monthsCompleted: 0,
    autoRenew: true,
    paymentStatus: "current", // "current", "overdue", "suspended"
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    createdAt: new Date(),
    updatedAt: new Date()
};

// Export for use (if using module system)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        samplePackages,
        samplePromotions,
        serviceCategories,
        sampleContact,
        sampleSubscription
    };
}

// Instructions for using this data:
// 1. After setting up Firebase, go to the admin panel (admin.html)
// 2. Use the "Add Package" button to create packages based on the samplePackages above
// 3. Use the "Add Promotion" button to create promotions based on samplePromotions
// 4. Upload appropriate images for each package/promotion using the image upload widget
// 5. Test the customer flow by signing up and subscribing to a package
