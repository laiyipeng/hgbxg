import qrcode


def generate_qr_code(url, output_file):
    # 创建二维码对象
    qr = qrcode.QRCode(
        version=1,  # 控制二维码的大小, 值越大, 尺寸越大 (1到40)
        error_correction=qrcode.constants.ERROR_CORRECT_L,  # 控制二维码的容错率
        box_size=10,  # 控制每个“盒子”的大小
        border=4,  # 控制边框的宽度 (盒子数)
    )

    # 向二维码对象中添加数据
    qr.add_data(url)
    qr.make(fit=True)

    # 创建一个图片对象
    img = qr.make_image(fill='black', back_color='white')

    # 将图片保存到文件中
    img.save(output_file)


# 示例使用
for i in range(23):
    url = f'http://121.40.166.187:9000/?num={i}'
    print(url)

    output_file = f"code/编号{i}.png"
    generate_qr_code(url, output_file)
