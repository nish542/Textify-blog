import React from 'react'

export default function About(props) {
    let myStyle = {
        backgroundColor: props.mode === 'dark' ? '#22262b' : 'rgb(246 241 230)',
        color: props.mode === 'dark' ? 'white' : 'black'
    }

    return (
        <div className="container py-4">
            <h2 className="mb-4">About us:</h2>
            <div className="row">
                <div className="col-lg-6 mb-4">
                    <div className="imageBox">
                        <img 
                            src="textpic.png" 
                            alt="Textify" 
                            className="img-fluid rounded-4 shadow"
                            style={{
                                width: '100%',
                                border: '10px solid',
                                borderColor: 'rgb(244 231 202)'
                            }}
                        />
                    </div>
                </div>
                <div className="col-lg-6 mb-4">
                    <div className="textBox p-4 rounded-4 shadow" 
                        style={{
                            backgroundColor: 'rgba(242, 236, 224, 0.4)',
                            border: '2px solid rgb(197 184 154)',
                            height: '100%'
                        }}
                    > 
                        <p className="text-center" style={{color: props.mode === 'dark' ? 'white' : 'black'}}>
                            TextUtils is a versatile tool used to manipulate and analyze text data efficiently. It provides various features like changing the case of text (upper, lower, and title case), removing extra spaces, counting words and characters, and copying text. Designed to simplify text formatting and transformation, TextUtils is ideal for users who handle a lot of textual content, such as writers, developers, or editors. It supports real-time modifications, improving productivity and ease of use. Whether for writing clean code, preparing documents, or improving readability, TextUtils offers convenient solutions for managing text effortlessly.
                        </p>
                    </div>
                </div>
            </div>

            <div className="accordion mt-4" id="accordionExample">
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button" style={myStyle} type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            <strong>Analyze Your text</strong>
                        </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                        <div className="accordion-body" style={myStyle}>
                            Textutils gives you a way to analyze your text quickly and efficiently. Be it word count, character count or
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" style={myStyle} type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            <strong>Free to use</strong>
                        </button>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body" style={myStyle}>
                            TextUtils is a free character counter tool that provides instant character count & word count statistics for a given text. Textutils reports the number of words and characters. Thus it is suitable for writing text with word/ character limit.
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" style={myStyle} type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                            <strong>Browser Compatibility</strong>
                        </button>
                    </h2>
                    <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body" style={myStyle}>
                            This word counter software works in any web browsers such as Chrome, Firefox, Internet Explorer, Safari, Opera. It suits to count characters in facebook, blog, books, excel document, pdf document, essays, etc.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}