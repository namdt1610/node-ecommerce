import { ProductType } from './product.entity'

export interface ProductDetails {
    id: string
    productId: string
    productType: ProductType
    details:
        | SmartphoneDetails
        | LaptopDetails
        | TabletDetails
        | AccessoryDetails
        | AudioDetails
        | WearableDetails
        | GamingDetails
        | SoftwareDetails
        | ServiceDetails
    createdAt: Date
    updatedAt: Date
}

// Smartphone Details (includes iPhone, Android, and other mobile devices)
export interface SmartphoneDetails {
    type: 'SMARTPHONE'
    display: SmartphoneDisplay
    processor: SmartphoneProcessor
    memory: SmartphoneMemory
    camera: SmartphoneCamera
    battery: SmartphoneBattery
    connectivity: SmartphoneConnectivity
    operatingSystem: SmartphoneOS
    security: SmartphoneSecurity
    sensors: string[]
    colors: string[]
    storageOptions: string[]
    waterResistance?: string
    wireless?: SmartphoneWireless
}

export interface SmartphoneDisplay {
    size: string // "6.1 inch"
    resolution: string // "2556 x 1179"
    technology: string // "Super Retina XDR"
    pixelDensity: string // "460 ppi"
    refreshRate?: string // "120Hz"
    brightness?: string // "1000 nits"
    hdr?: boolean
    protection?: string // "Ceramic Shield"
}

export interface SmartphoneProcessor {
    chipset: string // "A17 Pro"
    cpu: string // "6-core CPU"
    gpu: string // "6-core GPU"
    neuralEngine?: string // "16-core Neural Engine"
    process?: string // "3nm"
}

export interface SmartphoneMemory {
    ram: string // "8GB"
    storageOptions: string[] // ["128GB", "256GB", "512GB", "1TB"]
    expandable: boolean
    maxExpandable?: string
}

export interface SmartphoneCamera {
    main: CameraSpec
    ultraWide?: CameraSpec
    telephoto?: CameraSpec
    macro?: CameraSpec
    front: CameraSpec
    features: string[]
    videoRecording: VideoSpec[]
}

export interface CameraSpec {
    megapixels: string // "48MP"
    aperture: string // "f/1.78"
    sensorSize?: string
    opticalZoom?: string
    stabilization?: string
}

export interface VideoSpec {
    resolution: string // "4K"
    frameRate: string // "60fps"
    stabilization?: string
    features?: string[]
}

export interface SmartphoneBattery {
    capacity?: string // "3274 mAh"
    type: string // "Li-Ion"
    chargingSpeed: string // "20W"
    wirelessCharging?: string // "15W MagSafe"
    batteryLife: string // "Up to 20 hours video"
}

export interface SmartphoneConnectivity {
    cellular: string[] // ["5G", "4G LTE"]
    wifi: string[] // ["Wi-Fi 6E"]
    bluetooth: string // "5.3"
    nfc?: boolean
    usb?: string // "USB-C"
    lightning?: boolean
}

export interface SmartphoneOS {
    name: string // "iOS"
    version: string // "17"
    updateSupport?: string // "5 years"
}

export interface SmartphoneSecurity {
    biometric: string[] // ["Face ID", "Touch ID"]
    encryption?: string
    secureElement?: string
}

export interface SmartphoneWireless {
    magsafe?: boolean
    qi?: boolean
    airplay?: boolean
    airdrop?: boolean
}

// Laptop Details
export interface LaptopDetails {
    type: 'LAPTOP'
    display: LaptopDisplay
    processor: LaptopProcessor
    memory: LaptopMemory
    storage: LaptopStorage
    graphics: LaptopGraphics
    ports: LaptopPorts
    keyboard: LaptopKeyboard
    trackpad: LaptopTrackpad
    audio: LaptopAudio
    camera: LaptopCamera
    battery: LaptopBattery
    operatingSystem: LaptopOS
    build: LaptopBuild
}

export interface LaptopDisplay {
    size: string // "14 inch"
    resolution: string // "2560 x 1600"
    technology: string // "Liquid Retina"
    pixelDensity: string // "224 ppi"
    refreshRate?: string // "120Hz"
    brightness: string // "500 nits"
    colorGamut?: string // "P3"
    hdr?: boolean
    touchscreen?: boolean
}

export interface LaptopProcessor {
    brand: string // "Apple"
    model: string // "M3 Pro"
    cores: string // "11-core"
    baseFrequency?: string // "3.0 GHz"
    maxFrequency?: string // "4.0 GHz"
    cache?: string // "24MB"
    architecture: string // "ARM64"
}

export interface LaptopMemory {
    capacity: string // "16GB"
    type: string // "LPDDR5"
    speed?: string // "6400 MHz"
    expandable: boolean
    slots?: number
    maxCapacity?: string
}

export interface LaptopStorage {
    type: string // "SSD"
    capacity: string // "512GB"
    interface?: string // "NVMe"
    speed?: string // "7400 MB/s"
    expandable: boolean
    slots?: number
}

export interface LaptopGraphics {
    integrated?: string // "14-core GPU"
    dedicated?: string
    memory?: string // "Shared"
    performance?: string
}

export interface LaptopPorts {
    thunderbolt?: number
    usbc?: number
    usba?: number
    hdmi?: string // "HDMI 2.1"
    ethernet?: string
    audio?: string // "3.5mm"
    sdCard?: boolean
    other?: string[]
}

export interface LaptopKeyboard {
    type: string // "Magic Keyboard"
    backlit: boolean
    travel?: string // "1mm"
    layout: string // "US English"
    functionKeys: boolean
    numpad?: boolean
}

export interface LaptopTrackpad {
    type: string // "Force Touch"
    size?: string
    gestures: string[]
    hapticFeedback: boolean
}

export interface LaptopAudio {
    speakers: string // "6-speaker system"
    microphones: string // "3-mic array"
    spatialAudio?: boolean
    dolbyAtmos?: boolean
    studioQuality?: boolean
}

export interface LaptopCamera {
    resolution: string // "1080p"
    features: string[] // ["Center Stage"]
}

export interface LaptopBattery {
    capacity: string // "70Wh"
    life: string // "Up to 18 hours"
    chargingSpeed: string // "67W"
    fastCharging?: string
}

export interface LaptopOS {
    name: string // "macOS"
    version: string // "Sonoma"
    architecture: string // "64-bit"
}

export interface LaptopBuild {
    material: string // "Aluminum"
    dimensions: {
        length: number
        width: number
        height: number
        unit: 'mm' | 'inch'
    }
    weight: {
        value: number
        unit: 'kg' | 'lb'
    }
    colors: string[]
}

// Simplified interfaces for other product types
export interface TabletDetails {
    type: 'TABLET'
    display: Partial<SmartphoneDisplay>
    processor: Partial<SmartphoneProcessor>
    memory: Partial<SmartphoneMemory>
    camera: Partial<SmartphoneCamera>
    battery: Partial<SmartphoneBattery>
    connectivity: Partial<SmartphoneConnectivity>
    accessories?: string[] // ["Apple Pencil", "Magic Keyboard"]
}

export interface AccessoryDetails {
    type: 'ACCESSORIES'
    category: string // "Case", "Charger", "Cable", "Stand"
    compatibility: string[] // Product IDs or names
    material?: string
    features: string[]
    included?: string[]
}

export interface AudioDetails {
    type: 'AUDIO'
    category: string // "Headphones", "Speakers", "Earbuds"
    driver?: string // "40mm"
    frequency?: string // "20Hz - 20kHz"
    impedance?: string // "32 ohms"
    connectivity: string[] // ["Bluetooth 5.3", "Lightning", "3.5mm"]
    noiseCancellation?: boolean
    batteryLife?: string
    waterResistance?: string
}

export interface WearableDetails {
    type: 'WEARABLE'
    category: string // "Smartwatch", "Fitness Tracker"
    display?: Partial<SmartphoneDisplay>
    sensors: string[]
    battery?: Partial<SmartphoneBattery>
    connectivity: string[]
    waterResistance?: string
    compatibility: string[] // Device compatibility
}

export interface GamingDetails {
    type: 'GAMING'
    category: string // "Console", "Controller", "Game"
    platform?: string[] // ["PlayStation 5", "Xbox Series X"]
    performance?: {
        fps?: string
        resolution?: string
        rayTracing?: boolean
    }
    storage?: string
    connectivity?: string[]
}

export interface SoftwareDetails {
    type: 'SOFTWARE'
    category: string // "App", "Game", "Utility"
    platform: string[] // ["iOS", "macOS", "Windows"]
    requirements: {
        os?: string
        ram?: string
        storage?: string
        processor?: string
    }
    license: string // "Single User", "Family"
    subscription?: boolean
}

export interface ServiceDetails {
    type: 'SERVICES'
    category: string // "Warranty", "Support", "Cloud Storage"
    duration?: string // "1 year", "Monthly"
    coverage?: string[]
    limitations?: string[]
    renewable?: boolean
}

// Factory function to create product details based on type
export type ProductDetailsByType<T extends ProductType> = T extends 'SMARTPHONE'
    ? SmartphoneDetails
    : T extends 'LAPTOP'
      ? LaptopDetails
      : T extends 'TABLET'
        ? TabletDetails
        : T extends 'ACCESSORIES'
          ? AccessoryDetails
          : T extends 'AUDIO'
            ? AudioDetails
            : T extends 'WEARABLE'
              ? WearableDetails
              : T extends 'GAMING'
                ? GamingDetails
                : T extends 'SOFTWARE'
                  ? SoftwareDetails
                  : T extends 'SERVICES'
                    ? ServiceDetails
                    : never
