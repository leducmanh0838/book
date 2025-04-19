import requests
import pandas as pd

# URL API và các tham số
url = 'https://tiki.vn/api/personalish/v1/blocks/listings'
params = {
    'limit': 40,
    'include': 'advertisement',
    'aggregations': 2,
    'version': 'home-persionalized',
    'trackity_id': '75824ea8-f42f-d2f2-52ee-66d0b4d9a1df',
    'category': 67850,
    'page': 1,
    'urlKey': 'su-pham'
}

# Headers với ký tự an toàn
headers = {
    'accept': 'application/json, text/plain, */*',
    'accept-encoding': 'gzip, deflate, br, zstd',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'x-guest-token': 'QJomNgOMPYyKAauHZIb1RSUXxhBtW76E'
}

response = requests.get(url, headers=headers, params=params)

if response.status_code == 200:
    print("Request thành công!")
    data = response.json().get('data', [])

    # Khởi tạo danh sách để lưu thông tin sách
    book_list = []

    for item in data:
        # Lấy thông tin cần thiết
        book_name = item.get('name', 'N/A')
         # Trích xuất tên tác giả từ badges_new
        badges_new = item.get('badges_new', [])
        author = 'N/A'
        for badge in badges_new:
            if badge.get('code') == 'brand_name':
                author = badge.get('text', 'N/A')
                break
        price = item.get('price', 'N/A')
        quantity_sold = item.get('quantity_sold', None)
        sold = quantity_sold.get('value', 'N/A') if quantity_sold else 'N/A'  # Kiểm tra nếu 'quantity_sold' là None
        rating_average = item.get('rating_average', 'N/A')  # số lượng bình luận
        review_count = item.get('review_count', 'N/A')  # đánh giá sao
        img = item.get('thumbnail_url', 'N/A')

        # Thêm thông tin sách vào danh sách
        book_list.append({
            'ten sach': book_name,
            'ten tac gia': author,
            'gia sach': price,
            'so luong da ban': sold,
            'so luong binh luan': review_count,
            'danh gia trung binh': rating_average,
            'anh sach': img
        })

    # Chuyển đổi thành DataFrame pandas
    df = pd.DataFrame(book_list)

    # Lưu vào file CSV
    df.to_csv('SuPham.csv', index=False, encoding='utf-8')
    print("Dữ liệu đã được lưu vào books.csv")
else:
    print("Request thất bại với mã lỗi:", response.status_code)
