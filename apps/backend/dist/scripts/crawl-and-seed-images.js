"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadImage = downloadImage;
exports.updateProductImages = updateProductImages;
const database_1 = __importDefault(require("../config/database"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fs_2 = require("fs");
const promises_1 = require("stream/promises");
// Real iPhone images from various sources
const iphoneImages = [
    // iPhone 15 Series
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-pink?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1692923779972',
        filename: 'iphone-15-pink.webp',
        productModel: 'iPhone 15',
    },
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1692923779972',
        filename: 'iphone-15-blue.webp',
        productModel: 'iPhone 15',
    },
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-green?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1692923779972',
        filename: 'iphone-15-green.webp',
        productModel: 'iPhone 15',
    },
    // iPhone 15 Pro
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1692895622566',
        filename: 'iphone-15-pro-titanium.webp',
        productModel: 'iPhone 15 Pro',
    },
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-bluetitanium?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1692895622566',
        filename: 'iphone-15-pro-blue.webp',
        productModel: 'iPhone 15 Pro',
    },
    // iPhone 14 Series
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-purple?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1661027318304',
        filename: 'iphone-14-purple.webp',
        productModel: 'iPhone 14',
    },
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-blue?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1661027318304',
        filename: 'iphone-14-blue.webp',
        productModel: 'iPhone 14',
    },
    // iPhone 14 Pro
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch-deeppurple?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1663703841896',
        filename: 'iphone-14-pro-purple.webp',
        productModel: 'iPhone 14 Pro',
    },
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch-gold?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1663703841896',
        filename: 'iphone-14-pro-gold.webp',
        productModel: 'iPhone 14 Pro',
    },
    // iPhone 13 Series
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-finish-select-202108-6-1inch-pink?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1629842709000',
        filename: 'iphone-13-pink.webp',
        productModel: 'iPhone 13',
    },
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-finish-select-202108-6-1inch-blue?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1629842709000',
        filename: 'iphone-13-blue.webp',
        productModel: 'iPhone 13',
    },
    // iPhone 13 Pro
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pro-finish-select-202108-6-1inch-sierrablue?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1629842709000',
        filename: 'iphone-13-pro-sierra.webp',
        productModel: 'iPhone 13 Pro',
    },
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pro-finish-select-202108-6-1inch-gold?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1629842709000',
        filename: 'iphone-13-pro-gold.webp',
        productModel: 'iPhone 13 Pro',
    },
    // iPhone 12 Series
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-finish-select-202010-6-1inch-purple?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1617492703000',
        filename: 'iphone-12-purple.webp',
        productModel: 'iPhone 12',
    },
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-finish-select-202010-6-1inch-blue?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1604347703000',
        filename: 'iphone-12-blue.webp',
        productModel: 'iPhone 12',
    },
    // iPhone 12 Pro
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-pro-finish-select-202010-6-1inch-graphite?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1604347703000',
        filename: 'iphone-12-pro-graphite.webp',
        productModel: 'iPhone 12 Pro',
    },
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-pro-finish-select-202010-6-1inch-gold?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1604347703000',
        filename: 'iphone-12-pro-gold.webp',
        productModel: 'iPhone 12 Pro',
    },
    // iPhone 11 Series
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-11-finish-select-201909-purple?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1566956144418',
        filename: 'iphone-11-purple.webp',
        productModel: 'iPhone 11',
    },
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-11-finish-select-201909-green?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1566956144418',
        filename: 'iphone-11-green.webp',
        productModel: 'iPhone 11',
    },
    // iPhone 11 Pro
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-11-pro-finish-select-201909-midnightgreen?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1566956144418',
        filename: 'iphone-11-pro-green.webp',
        productModel: 'iPhone 11 Pro',
    },
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-11-pro-finish-select-201909-gold?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1566956144418',
        filename: 'iphone-11-pro-gold.webp',
        productModel: 'iPhone 11 Pro',
    },
    // iPhone XS
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-xs-finish-select-201809-gold?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1535756699441',
        filename: 'iphone-xs-gold.webp',
        productModel: 'iPhone XS',
    },
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-xs-finish-select-201809-spacegray?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1535756699441',
        filename: 'iphone-xs-space-gray.webp',
        productModel: 'iPhone XS',
    },
    // iPhone XR
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-xr-finish-select-201809-red?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1535756699441',
        filename: 'iphone-xr-red.webp',
        productModel: 'iPhone XR',
    },
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-xr-finish-select-201809-blue?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1535756699441',
        filename: 'iphone-xr-blue.webp',
        productModel: 'iPhone XR',
    },
    // iPhone X
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-x-finish-select-201709-silver?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1504722467072',
        filename: 'iphone-x-silver.webp',
        productModel: 'iPhone X',
    },
    {
        url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-x-finish-select-201709-spacegray?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1504722467072',
        filename: 'iphone-x-space-gray.webp',
        productModel: 'iPhone X',
    },
];
// Alternative image sources if Apple's CDN fails
const alternativeImageSources = [
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80', // iPhone X
    'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&q=80', // iPhone
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&q=80', // iPhone 11
    'https://images.unsplash.com/photo-1603891128711-11b4b03bb138?w=800&q=80', // iPhone 12
    'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&q=80', // iPhone 13
    'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=800&q=80', // iPhone 14
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80', // iPhone 15
];
async function downloadImage(url, filename) {
    try {
        const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
        // Create uploads directory if it doesn't exist
        if (!fs_1.default.existsSync(uploadsDir)) {
            fs_1.default.mkdirSync(uploadsDir, { recursive: true });
        }
        const filePath = path_1.default.join(uploadsDir, filename);
        // Skip if file already exists
        if (fs_1.default.existsSync(filePath)) {
            console.log(`Image already exists: ${filename}`);
            return true;
        }
        console.log(`Downloading image: ${filename} from ${url}`);
        const response = await (0, axios_1.default)({
            method: 'GET',
            url: url,
            responseType: 'stream',
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });
        await (0, promises_1.pipeline)(response.data, (0, fs_2.createWriteStream)(filePath));
        console.log(`Successfully downloaded: ${filename}`);
        return true;
    }
    catch (error) {
        console.error(`Failed to download ${filename}:`, error instanceof Error ? error.message : error);
        return false;
    }
}
async function downloadAlternativeImages() {
    const downloadedImages = [];
    for (let i = 0; i < alternativeImageSources.length; i++) {
        const url = alternativeImageSources[i];
        const filename = `iphone-alt-${i + 1}.jpg`;
        const success = await downloadImage(url, filename);
        if (success) {
            downloadedImages.push(filename);
        }
    }
    return downloadedImages;
}
async function updateProductImages() {
    try {
        console.log('Starting to update product images...');
        // Download all images
        const downloadPromises = iphoneImages.map((image) => downloadImage(image.url, image.filename));
        const downloadResults = await Promise.allSettled(downloadPromises);
        // Get list of successfully downloaded images
        const successfulDownloads = iphoneImages.filter((_, index) => downloadResults[index].status === 'fulfilled' &&
            downloadResults[index]
                .value);
        // Download alternative images if needed
        const alternativeImages = await downloadAlternativeImages();
        console.log(`Successfully downloaded ${successfulDownloads.length} primary images`);
        console.log(`Successfully downloaded ${alternativeImages.length} alternative images`);
        // Get all products from database
        const products = await database_1.default.product.findMany({
            where: {
                OR: [
                    { name: { contains: 'iPhone', mode: 'insensitive' } },
                    { brand: 'Apple' },
                ],
            },
        });
        console.log(`Found ${products.length} iPhone products in database`);
        // Update each product with appropriate images
        for (const product of products) {
            console.log(`Updating images for product: ${product.name}`);
            // Find matching images for this product
            const matchingImages = successfulDownloads.filter((img) => product.name
                .toLowerCase()
                .includes(img.productModel.toLowerCase().replace('iphone ', '')));
            let imagesToUse = [];
            if (matchingImages.length > 0) {
                // Use specific images for this iPhone model
                imagesToUse = matchingImages.map((img) => `/uploads/${img.filename}`);
            }
            else {
                // Use alternative images if no specific match
                const randomImages = alternativeImages
                    .sort(() => Math.random() - 0.5)
                    .slice(0, Math.min(3, alternativeImages.length))
                    .map((img) => `/uploads/${img}`);
                imagesToUse = randomImages;
            }
            // Add some variety - include multiple images per product
            if (imagesToUse.length < 3) {
                const additionalImages = alternativeImages
                    .filter((img) => !imagesToUse.includes(`/uploads/${img}`))
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3 - imagesToUse.length)
                    .map((img) => `/uploads/${img}`);
                imagesToUse = [...imagesToUse, ...additionalImages];
            }
            if (imagesToUse.length > 0) {
                await database_1.default.product.update({
                    where: { id: product.id },
                    data: {
                        images: JSON.stringify(imagesToUse),
                    },
                });
                console.log(`Updated ${product.name} with ${imagesToUse.length} images`);
            }
        }
        console.log('Successfully updated all product images!');
    }
    catch (error) {
        console.error('Error updating product images:', error);
        throw error;
    }
}
async function main() {
    try {
        console.log('Starting image crawling and seeding process...');
        await updateProductImages();
        console.log('Image crawling and seeding completed successfully!');
    }
    catch (error) {
        console.error('Error in main process:', error);
        process.exit(1);
    }
    finally {
        await database_1.default.$disconnect();
    }
}
if (require.main === module) {
    main();
}
