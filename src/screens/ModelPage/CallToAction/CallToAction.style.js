import styled from 'styled-components';

export const CallToActionBox = styled.div`
  margin-top: 2rem;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  color: rgba(0, 0, 0, 0.7);
  font-size: 1rem;
  line-height: 1.5rem;

  @media (min-width: 900px) {
    flex-direction: row;
  }
`;

export const Section = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);

  @media (min-width: 900px) {
    width: 50%;
    border-right: 1px solid rgba(0, 0, 0, 0.12);
    border-bottom: none;
  }

  &:last-child {
    border: none;
  }
`;

export const Title = styled.div`
  background: #f2f2f2;
  padding: 16px;
  font-weight: bold;
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);

  @media (min-width: 600px) {
    text-align: center;
  }
`;

export const Content = styled.div`
  padding: 16px;
  display: flex;
  align-items: flex-start;
  text-align: left;

  @media (min-width: 600px) {
    justify-content: center;
  }
`;

export const Icon = styled.div`
  display: flex;
  margin-right: 16px;
`;
