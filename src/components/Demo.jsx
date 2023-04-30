import { useState, useEffect } from 'react';
import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {

    const [article, setArticle] = useState({
        url: "",
        summary: "",
    });

    const [allArticles, setAllArticles] = useState([]);
    const [copied, setCopied] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

    useEffect(() => {
        const articleFromLocalStorage = JSON.parse(
            window.localStorage.getItem("articles")
        );

        if(articleFromLocalStorage) {
            setArticle(articleFromLocalStorage);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const existingArticle = allArticles.find(
            (item) => item.url === article.url,
        );

        setIsLoading(true);
        if(existingArticle) return setArticle(existingArticle);

        const { data } = await getSummary({
            articleUrl: article.url,
        });
        setIsLoading(false);

        if(data?.summary) {
            const newArticle = { ...article, summary: data.summary };
            const updatedAllArticles = [newArticle, ...allArticles];

             // update state and local storage
            setArticle(newArticle);
            setAllArticles(updatedAllArticles);
            localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
        }
        console.log(data);
    };

    const handleCopy = (copyUrl) => {
        setCopied(copyUrl);
        navigator.clipboard.writeText(copyUrl);
        setTimeout(() => setCopied(false), 3000);
    };

    const handleKeyDown = (e) => {
        if(e.keyCode === 13){
            handleSubmit(e);
        }
    }

    const handleClearHistory = () => {
        setAllArticles([]);
        localStorage.removeItem("articles");
    }

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
                        onSubmit={handleSubmit}
                    >
                        <img
                            src={linkIcon}
                            alt='linkIcon'
                            className='absolute left-0 my-2 ml-3 w-5'
                        />

                        <input
                            type='url'
                            placeholder='Paste the article link'
                            value={article.url || ''}
                            onChange={(e) => setArticle({...article, url: e.target.value})}
                            onKeyDown={handleKeyDown}
                            required
                            className='url_input peer'
                        />
                        <button
                            type='submit'
                            className='submit_btn
                            peer-focus:border-gray-700
                            peer-focus:text-gray-700'
                            disabled={isLoading}
                        >
                            {isLoading
                                ?<img
                                    src={loader}
                                    alt="loading icon"
                                    className="w-4 h-4"
                                />
                                : <p>↵</p>
                            }
                        </button>
                    </form>

                    <button
                        className="bg-slate-400 flex
                        items-center justify-center rounded-2xl py-1"
                        onClick={handleClearHistory}
                    >
                        Clear History
                    </button>

                    {isLoading && (
                        <div className="flex items-center justify-center mt-4">
                            <div className="w-32 h-1 bg-gray-300 rounded-full">
                                <div className="w-24 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    )}
                    {/* Browser History */}
                    <div
                        className='flex flex-col gap-1
                        max-h-60 overflow-y-auto'
                    >
                        {allArticles.map((item, index) => (
                            <div
                                key={`link-${index}`}
                                tabIndex={index}
                                onClick={() => setArticle(item)}
                                className='link_card'
                            >
                                <div
                                    className='copy-btn'
                                    onClick={() => handleCopy(item.url)}
                                >
                                    <img
                                        src={copied === item.url ? tick : copy}
                                        alt={copied === item.url ? "tick_icon" : "copy_icon"}
                                        className='w-[100%] h-[100%] object-contain'
                                    />
                                </div>
                                <p
                                    className='flex-1 text-blue-500
                                    font-medium text-sm truncate'
                                >
                                    {item.url}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Display Result */}
                <div
                    className='my-10 max-w-full flex
                    justify-center items-center'
                >
                    {isFetching ? (
                        <img
                            src={loader}
                            alt='loader'
                            className='w-20 h-20 object-contain'
                        />
                    ): error ? (
                        <p
                            className='font-inter font-bold
                            text-black text-center'
                        >
                            Well, that wasn't supposed to happen...
                            <br />
                            <span
                                className='font-satoshi font-bold text-gray-700'
                            >
                                {error?.data?.error}
                            </span>
                        </p>
                    ) : (
                        article.summary && (
                            <div
                                className='flex flex-col gap-3'
                            >
                                <h2
                                    className='font-satoshi font-bold
                                    text-gray-600 text-xl'
                                >
                                    Article
                                    <span className='blue_gradient'>
                                        Summary
                                    </span>
                                </h2>
                                <div
                                    className="summary_box"
                                >
                                    <p
                                        className='font-inter font-medium
                                        text-sm text-gray-700'
                                    >
                                        {article.summary}
                                    </p>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </section>
        </>
    );
};

export default Demo;
