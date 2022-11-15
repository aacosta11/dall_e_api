export function downloadBase64File(base64Data: any, fileName: string = 'img') {
    const linkSource = `${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
}