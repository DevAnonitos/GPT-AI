import { useState, useEffect } from 'react';
import { copy, linkIcon, loader, tick } from "../assets";

const Demo = () => {

    const [article, setArticle] = useState({
        url: "",
        summary: "",
    });

    return (
        <>
            <section
                className='mt-16 w-full max-w-xl'
            >
                <div
                    className='flex flex-col w-full gap-2'
                >
                    <form
                        className='relative flex justify-center items-center'
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <img
                            src={linkIcon}
                            alt='linkIcon'
                            className='absolute left-0 my-2 ml-3 w-5'
                        />

                        <input
                            type='url'
                            placeholder='Paste the article link'
                            value={article.url}
                            onChange={() => {}}
                            onKeyDown={() => {}}
                            required
                            className='url_input peer'
                        />
                        <button
                            type='submit'
                            className='submit_btn
                            peer-focus:border-gray-700
                            peer-focus:text-gray-700'
                        >
                            <p>↵</p>
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
};

export default Demo;
