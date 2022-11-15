
function createPElement(text: string) {
    let p = document.createElement('p');
    p.innerHTML = text;
    return p;
}

export function validatePrompt(prompt: string, errorTxt: Element) : number {
    if (prompt.length > 5) return 1;
    console.warn('your prompt should be a little longer');
    errorTxt.appendChild(createPElement('more words!'))
    return -1;
}

export function validateN(n: number, errorTxt: Element) : number {
    if (n > 0 && n <= 10) return 1;
    console.warn('choose an \'n\' value between 1 and 10');
    errorTxt.appendChild(createPElement('invalid \'n\' value!'));
    return -1;
}

export function validateSize(size: string, errorTxt: Element) : number {
    if (size === '256x256' || size === '512x512' || size === '1024x1024') return 1;
    console.warn('plz choose one of the provided resolutions: 256x256 512x512 and 1024x1024');
    errorTxt.appendChild(createPElement('invalid size!'));
    return -1;
}