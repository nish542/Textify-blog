import React from 'react'
import { useScrollToTop } from '../hooks/useScrollToTop';
import { FaLinkedin, FaGithub, FaInstagram, FaEnvelope } from 'react-icons/fa';

export default function About(props) {
    useScrollToTop();
    let myStyle = {
        backgroundColor: props.mode === 'dark' ? '#22262b' : 'rgb(246 241 230)',
        color: props.mode === 'dark' ? 'white' : 'black'
    }

    const socialLinks = [
        {
            icon: <FaLinkedin size={24} />,
            url: 'https://www.linkedin.com/in/nishant-anand-75b544325/',
            label: 'LinkedIn'
        },
        {
            icon: <FaGithub size={24} />,
            url: 'https://github.com/nish542',
            label: 'GitHub'
        },
        {
            icon: <FaInstagram size={24} />,
            url: 'https://www.instagram.com/_nish.ant_._/',
            label: 'Instagram'
        },
        {
            icon: <FaEnvelope size={24} />,
            url: 'mailto:nishant.anand542@gmail.com',
            label: 'Email'
        }
    ];

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
                        <p className="mb-0 text-justify" style={{
                            color: props.mode === 'dark' ? 'white' : 'black',
                            textAlign: 'justify',
                            textJustify: 'inter-word'
                        }}>
                            Textify is a modern web-based platform that allows users to write, edit, and share content effortlessly in a clean and focused environment. It offers two core features: a powerful text manipulation tool for formatting, cleaning, and enhancing written content, and an anonymous blogging section where users can post their thoughts without creating an account. Each blog post remains live for 10 days before being automatically deleted, ensuring simplicity and privacy. Designed for writers, thinkers, and everyday users, Textify eliminates distractions and unnecessary steps, making it easy to express ideas freely and intelligently.
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
                        <div className="accordion-body text-justify" style={myStyle}>
                        The Text Manipulation feature in Textify helps you clean, format, and enhance your text with ease. Whether you're fixing grammar, changing case, removing extra spaces, or translating content, Textify offers quick, efficient tools to make your writing sharp and polished — all in a single click, without needing external software.                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" style={myStyle} type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            <strong>Free to use</strong>
                        </button>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body text-justify" style={myStyle}>
                            Textify is a free character counter tool that provides instant character count & word count statistics for a given text. Textify reports the number of words and characters. Thus it is suitable for writing text with word/ character limit.
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" style={myStyle} type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                            <strong>Share Freely, Stay Anonymous</strong>
                        </button>
                    </h2>
                    <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body text-justify" style={myStyle}>
                        The Blog feature on Textify lets anyone post their thoughts anonymously without needing to sign up. Each blog is visible to everyone and stays live for 10 days before being automatically deleted, keeping the platform clean, simple, and focused on fresh content.                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid px-0 py-5" >
                <div className="row g-0">
                    <div className="col-12">
                        <div className="text-center p-3 rounded-4 shadow" 
                            style={{
                                backgroundColor: 'rgba(242, 236, 224, 0.4)',
                                border: '2px solid rgb(197 184 154)',
                            }}
                        >
                            <h3 className="mb-3 text-center" style={{color: props.mode === 'dark' ? 'white' : 'black'}}>Created By</h3>
                            <div className="row align-items-center justify-content-center">
                                <div className="col-md-6 mb-3 mb-md-0">
                                    <img 
                                        src="/Nishant_picture.png" 
                                        alt="Nishant Anand" 
                                        className="img-fluid rounded-4 shadow"
                                        style={{
                                            width: '100%',
                                            maxWidth: '200px',
                                            border: '6px solid',
                                            borderColor: '#ebdeb0'
                                        }}
                                    />
                                    <div className="mt-3 d-flex justify-content-center gap-3">
                                        {socialLinks.map((link, index) => (
                                            <a
                                                key={index}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-decoration-none"
                                                style={{
                                                    color: props.mode === 'dark' ? '#f5e6d3' : '#6c757d',
                                                    transition: 'all 0.3s ease',
                                                    padding: '8px',
                                                    borderRadius: '50%',
                                                    backgroundColor: props.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                                                }}
                                                onMouseOver={e => {
                                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                                    e.currentTarget.style.color = props.mode === 'dark' ? '#ffb347' : '#ff9800';
                                                }}
                                                onMouseOut={e => {
                                                    e.currentTarget.style.transform = 'none';
                                                    e.currentTarget.style.color = props.mode === 'dark' ? '#f5e6d3' : '#6c757d';
                                                }}
                                                title={link.label}
                                            >
                                                {link.icon}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-md-6 text-start">
                                    <h4 className="mb-2" style={{color: props.mode === 'dark' ? 'white' : 'black'}}>Nishant Anand</h4>
                                    <p className="mb-0 text-justify" style={{color: props.mode === 'dark' ? 'white' : 'black'}}>
                                        The creator and developer behind Textify, bringing together modern design and powerful functionality.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}