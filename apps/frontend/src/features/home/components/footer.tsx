import { Button } from '@/components/ui/button'

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h4 className="text-lg font-semibold mb-4">ShopVite</h4>
                        <p className="text-gray-400">
                            Nền tảng thương mại điện tử hàng đầu Việt Nam
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">
                            Về chúng tôi
                        </h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <a href="#" className="hover:text-white">
                                    Giới thiệu
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">
                                    Tuyển dụng
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">
                                    Tin tức
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Hỗ trợ</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <a href="#" className="hover:text-white">
                                    Trung tâm trợ giúp
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">
                                    Liên hệ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">
                                    Chính sách
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">
                            Theo dõi chúng tôi
                        </h4>
                        <div className="flex space-x-4">
                            <Button variant="ghost" size="icon">
                                <span>FB</span>
                            </Button>
                            <Button variant="ghost" size="icon">
                                <span>IG</span>
                            </Button>
                            <Button variant="ghost" size="icon">
                                <span>TW</span>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 ShopVite. Tất cả quyền được bảo lưu.</p>
                </div>
            </div>
        </footer>
    )
}
