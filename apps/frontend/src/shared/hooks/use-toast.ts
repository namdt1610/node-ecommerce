'use client'

import { toast } from 'sonner'

export const useToast = () => {
    const showSuccess = (message: string, description?: string) => {
        toast.success(message, {
            description,
            duration: 3000,
        })
    }

    const showError = (message: string, description?: string) => {
        toast.error(message, {
            description,
            duration: 4000,
        })
    }

    const showWarning = (message: string, description?: string) => {
        toast.warning(message, {
            description,
            duration: 3500,
        })
    }

    const showInfo = (message: string, description?: string) => {
        toast.info(message, {
            description,
            duration: 3000,
        })
    }

    const showLoading = (message: string = 'Đang xử lý...') => {
        return toast.loading(message)
    }

    const dismiss = (id?: string | number) => {
        toast.dismiss(id)
    }

    const dismissAll = () => {
        toast.dismiss()
    }

    // Convenience methods with Vietnamese messages
    const success = {
        login: () => showSuccess('Đăng nhập thành công!', 'Chào mừng bạn quay lại'),
        logout: () => showSuccess('Đăng xuất thành công!', 'Hẹn gặp lại bạn'),
        register: () => showSuccess('Đăng ký thành công!', 'Chào mừng bạn đến với ShopVite'),
        addToCart: (productName?: string) => 
            showSuccess('Thêm vào giỏ hàng thành công!', productName ? `${productName} đã được thêm vào giỏ hàng` : undefined),
        removeFromCart: (productName?: string) => 
            showSuccess('Đã xóa khỏi giỏ hàng', productName ? `${productName} đã được xóa khỏi giỏ hàng` : undefined),
        updateCart: () => showSuccess('Cập nhật giỏ hàng thành công!'),
        orderPlaced: (orderId?: string) => 
            showSuccess('Đặt hàng thành công!', orderId ? `Mã đơn hàng: ${orderId}` : 'Cảm ơn bạn đã mua hàng'),
        orderCancelled: () => showSuccess('Hủy đơn hàng thành công!'),
        profileUpdated: () => showSuccess('Cập nhật thông tin thành công!'),
        passwordChanged: () => showSuccess('Đổi mật khẩu thành công!'),
        dataLoaded: () => showSuccess('Tải dữ liệu thành công!'),
        dataSaved: () => showSuccess('Lưu dữ liệu thành công!'),
        copied: () => showSuccess('Đã sao chép!'),
    }

    const error = {
        login: () => showError('Đăng nhập thất bại!', 'Vui lòng kiểm tra lại email và mật khẩu'),
        register: () => showError('Đăng ký thất bại!', 'Vui lòng thử lại sau'),
        network: () => showError('Lỗi kết nối!', 'Vui lòng kiểm tra kết nối internet'),
        server: () => showError('Lỗi máy chủ!', 'Vui lòng thử lại sau'),
        notFound: () => showError('Không tìm thấy!', 'Dữ liệu không tồn tại'),
        unauthorized: () => showError('Không có quyền truy cập!', 'Vui lòng đăng nhập lại'),
        validation: (message?: string) => showError('Dữ liệu không hợp lệ!', message),
        addToCart: () => showError('Thêm vào giỏ hàng thất bại!', 'Vui lòng thử lại'),
        cartUpdate: () => showError('Cập nhật giỏ hàng thất bại!', 'Vui lòng thử lại'),
        orderFailed: () => showError('Đặt hàng thất bại!', 'Vui lòng thử lại sau'),
        loadFailed: () => showError('Tải dữ liệu thất bại!', 'Vui lòng thử lại'),
        saveFailed: () => showError('Lưu dữ liệu thất bại!', 'Vui lòng thử lại'),
    }

    const warning = {
        sessionExpired: () => showWarning('Phiên đăng nhập hết hạn!', 'Vui lòng đăng nhập lại'),
        lowStock: (quantity?: number) => 
            showWarning('Sản phẩm sắp hết hàng!', quantity ? `Chỉ còn ${quantity} sản phẩm` : undefined),
        maxQuantity: () => showWarning('Đã đạt số lượng tối đa!', 'Không thể thêm nhiều hơn'),
        emptyCart: () => showWarning('Giỏ hàng trống!', 'Vui lòng thêm sản phẩm trước khi thanh toán'),
        unsavedChanges: () => showWarning('Có thay đổi chưa được lưu!', 'Bạn có muốn lưu trước khi rời khỏi?'),
    }

    const info = {
        loading: () => showInfo('Đang tải...'),
        processing: () => showInfo('Đang xử lý...'),
        updating: () => showInfo('Đang cập nhật...'),
        saving: () => showInfo('Đang lưu...'),
    }

    return {
        // Basic methods
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showLoading,
        dismiss,
        dismissAll,
        
        // Convenience methods
        success,
        error,
        warning,
        info,
        
        // Direct access to sonner toast
        toast,
    }
} 