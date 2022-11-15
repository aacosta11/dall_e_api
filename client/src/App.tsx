import { Fragment, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Transition } from '@headlessui/react';
import { validatePrompt, validateN, validateSize } from './ts/validate';
// import { downloadImage } from './ts/download';
import { ShareIcon, XMarkIcon, DownloadIcon } from './Icons';

function App() {
  const [activeImageSrc, setActiveImageSrc] = useState<string[]>([]);
  const gridContainerRef = useRef<Element | null>(document.querySelector('#grid-container'));
  
  const clearErrorMessages = () => {
    const errorTxt = document.querySelector('#error-text');
    errorTxt?.querySelectorAll('p').forEach(p => p.remove());
    return errorTxt as Element;
  }

  const generateNewImage = (e: any) => {
    // clear previous error messages
    const errorTxt = clearErrorMessages();
    // get form data
    const prompt = e.target.prompt.value.toString();
    const n = parseInt(e.target.n.value);
    const size = e.target.size.value.toString();

    // validate data
    let err: number = 0;
    err += validatePrompt(prompt, errorTxt);
    err += validateN(n, errorTxt);
    err += validateSize(size, errorTxt);
    if (err < 3) return;

    // disable button
    const button = (document.querySelector('#submit') as HTMLButtonElement);
    button.disabled = true;
    button.innerHTML = `
      <div class="w-4 h-4 border-t border-l border-white rounded-full animate-[spin_1s_ease-in-out_infinite]"></div>
    `;

    // make request to our express api
    axios
      .post('/api/generate-image', {prompt,n,size})
      .then((res) =>{ 
        console.log(res)
        // enable button
        button.disabled = false;
        button.innerHTML = "Generate";
        // add image to grid
        res.data.forEach((img : {url: string, [key:string]: any}) => addImageToGrid(img.url, prompt));
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const addImageToGrid = (src: string, prompt: string) => {
    // create img element
    const img = document.createElement('img');
    img.classList.add('aspect-square', 'bg-gray-100', 'cursor-zoom-in');
    img.src = src;
    img.alt = prompt;
    img.addEventListener('click', () => setActiveImageSrc([src,prompt]));
    // append img element
    gridContainerRef.current?.appendChild(img);
  }

  useEffect(() => {
    // make sure the container for generated images is present
    if (gridContainerRef.current === null) {
      gridContainerRef.current = document.querySelector('#grid-container');
    }

    return () => {
      // remove event listeners for each generated image
      document.querySelectorAll('img').forEach((img) => {
        img.removeEventListener('click', () => { })
      })
    }
  }, [])

  return (
    <Fragment>
      <h1 className="max-w-5xl mx-auto mt-20 px-6 sm:px-12">DALL·E Api</h1>
      {/* ---------------------------------- FORM ---------------------------------- */}
      <form className="relative max-w-5xl mx-auto mt-6 px-6 sm:px-12 [&_label]:block [&_input]:px-4 [&_select]:px-4 [&_input]:h-10 [&_select]:h-10 [&_input]:mt-2 [&_select]:mt-2 [&_input]:outline-none"
        onSubmit={(e) => {
          e.preventDefault();
          generateNewImage(e);
          // addImageToGrid('1');
        }}
      >
        {/* prompt */}
        <label htmlFor="prompt">Enter a prompt</label>
        <textarea name="prompt" id="prompt" className="w-full px-4 pt-1 bg-gray-100 text-gray-900 resize-y outline-none" placeholder="type here" autoComplete='off'></textarea>
        {/* n */}
        <span className="inline-block mt-3">
          <label htmlFor="n">1-10</label>
          <input type="number" name="n" id="n" autoComplete='off' defaultValue={1} min={1} max={10} />
        </span>
        {/* size */}
        <span className="inline-block ml-3">
          <label htmlFor="size">res</label>
          <select name="size" id="size" defaultValue="512x512">
            <option value="256x256">256x256</option>
            <option value="512x512">512x512</option>
            <option value="1024x1024">1024x1024</option>
          </select>
        </span>
        {/* SUBMIT */}
        <button id="submit" className="mt-6 w-[130px] h-[48px] flex justify-center items-center rounded-xl bg-blue-600 disabled:bg-blue-600/50">Generate</button>
        <div id="error-text" className="text-red-600 mt-4 flex flex-col gap-2"></div>
      </form>
      {/* ---------------------------- GENERATED IMAGES ---------------------------- */}
      <ul id="grid-container" className="grid grid-cols-2 gap-4 max-w-3xl mt-6 mx-auto"></ul>
      {/* ----------------------------- ENLARGED IMAGE ----------------------------- */}
      <Transition
        show={activeImageSrc.length > 0}
        enter='transition-opacity ease-in duration-200'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transition-opacity ease-out duration-200'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        <figure id="expansion-container"
          onClick={(e: any) => {
            if (e.target.id == 'expansion-container') { setActiveImageSrc([]) }
          }}
          className="fixed inset-0 mx-auto overflow-y-auto bg-black/30 backdrop-blur-sm cursor-zoom-out"
        >
          <div id="image-expansion" className="relative max-w-xl mx-auto mt-6 mb-20 md:mb-6 px-4 pt-4 pb-16 rounded-xl bg-gray-200 cursor-default">
            {/* user actions */}
            <ul id="user-actions" className="absolute top-[102%] md:top-0 right-0 md:-right-14 flex md:flex-col gap-2 [&_li]:w-12 [&_li]:h-12 [&_li]:ease-in-out [&_li]:duration-200">
              {/* close */}
              <li className="hover:bg-gray-600 cursor-pointer " onClick={()=>setActiveImageSrc([])}><XMarkIcon className="w-full h-full p-2" /></li>
              {/* share */}
              <li className="hover:bg-gray-600/60"><ShareIcon className="w-full h-full p-2 stroke-white/60" /></li>
              {/* download */}
              <li className="hover:bg-gray-600/60"><DownloadIcon className="w-full h-full p-2 stroke-white/60" /></li>
            </ul>
            {/* image */}
            <img src={activeImageSrc[0]} alt="" className="mx-auto aspect-square bg-gray-300" />
            <p className="mt-6 text-black">{activeImageSrc[1]}</p>
            <p className="absolute bottom-3 text-gray-400">
              powered by DALL·E
            </p>
          </div>
        </figure>
      </Transition>
    </Fragment>
  )
}
export default App