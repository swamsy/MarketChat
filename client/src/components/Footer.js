import styled from 'styled-components'

function Footer() {
    return (
    <FooterContainer>
        <FooterContent>
            <p>© MarketChat 2023</p>
        </FooterContent>
    </FooterContainer>
    );
}

const FooterContainer = styled.div`
    padding: 1.5rem;
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.12);
`;

const FooterContent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default Footer;