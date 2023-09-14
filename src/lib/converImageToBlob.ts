import ImageResize from "image-resize";

interface ImageResizeOptions {
    file: File;
    width?: number;
    height?: number;
    quality?: number;
}

export const converImageToBlob = async ({ file, width = undefined, height = 100, quality = 0.5 }: ImageResizeOptions) => {
    // SVGなどの画像以外のファイルはそのまま返す
    if (file.type !== "image/jpeg" && file.type !== "image/png") return file;
    
    const imageResize = new ImageResize();

    // オプション設定
    const options = await imageResize.updateOptions({ width: width, height: height, quality: quality }).get(file);

    // 画像の圧縮
    const result = await imageResize.resize(options);

    // 画像の出力
    const blob = (await imageResize.output(result, {
        outputType: "blob",
    })) as Blob;

    const newFile = new File([blob], file.name, { type: file.type });

    return newFile;
};
