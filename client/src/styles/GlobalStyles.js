import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    :root {
        --main-font-family: 'Inter', sans-serif;

    }

    *, *:before, *:after {
        box-sizing: border-box;
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
        margin: 0;
    }

    h1 {
        font-weight: 600;
        font-size: 40px;
    }

    h2 {
        font-weight: 600;
        font-size: 36px;
    }

    h3 {
        font-weight: 600;
        font-size: 30px;
    }

    h4 {
        font-weight: 600;
        font-size: 24px;
    }

    h5 {
        font-weight: 500;
        font-size: 20px;
    }
    
    h6 {
        font-weight: 500;
        font-size: 18px;
    }

    p {
        color: ${(props) => props.theme.colors[950]};
        font-family: var(--main-font-family);
        font-size: 16px;
        font-weight: 500;
        line-height: 1.75;
        margin: 0;
    }

    button {
        font-family: var(--main-font-family);
    }

    input {
        font-family: var(--main-font-family);
    }

    textarea {
        font-family: var(--main-font-family);
        font-size: 16px;
    }

    &::placeholder {
        font-family: var(--main-font-family);
        color: ${(props) => props.theme.colors[300]};
    }

    @media (max-width: 768px) {
        h1 { font-size: 34px; }
        h2 { font-size: 30px; }
        h3 { font-size: 26px; }
        h4 { font-size: 20px; }
        h5 { font-size: 16px; }
        h6 { font-size: 14px; }
        p, a, textarea { font-size: 14px; }
    }
`;

export default GlobalStyles;
