import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');

    :root {
        --main-font-family: 'Inter', sans-serif;

    }
    
    body {
        background-color: ${(props) => props.theme.colors.backgroundColor};
        font-family: var(--main-font-family);
        margin: 0;
        padding: 0;
    }

    h1, h2, h3, h4, h5, h6 {
        color: ${(props) => props.theme.colors[950]};
        font-family: var(--main-font-family);
    }

    h1 {
        font-weight: 700;
        font-size: 48px;
    }

    h2 {
        font-weight: 700;
        font-size: 36px;
    }

    h3 {
        font-weight: 700;
        font-size: 30px;
    }

    h4 {
        font-weight: 600;
        font-size: 24px;
    }

    h5 {
        font-weight: 600;
        font-size: 20px;
    }
    
    h6 {
        font-weight: 600;
        font-size: 16px;
    }

    p {
        color: ${(props) => props.theme.colors[950]};
        font-family: var(--main-font-family);
        font-size: 16px;
        font-weight: 500;
        line-height: 1.75;
    }

    a {
        text-decoration: none;
        color: ${(props) => props.theme.colors[950]};
        font-family: var(--main-font-family);
        font-weight: 500;
        font-size: 16px;
        
        &:hover {
        color: ${(props) => props.theme.colors[950]};
        }
    }

    button {
        font-family: var(--main-font-family);

        &:focus {
        outline: none;
        }
    }

    input {
        font-family: var(--main-font-family);
    }

    @media (max-width: 576px) {
        h1 { font-size: 36px; }
        h2 { font-size: 32px; }
        h3 { font-size: 26px; }
        h4 { font-size: 22px; }
        h5 { font-size: 18px; }
        h6 { font-size: 16px; }
        p, a { font-size: 12px; }
    }
`;

export default GlobalStyles;
