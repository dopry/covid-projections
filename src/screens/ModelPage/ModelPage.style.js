import styled from 'styled-components';

export const Wrapper = styled.div``;

export const Content = styled.div`
  text-align: center;
  max-width: 900px;
  padding: 32px;
  margin: auto;
  @media (min-width: 600px) {
    padding: 0;
  }
`;

export const ChartHeader = styled.div`
  max-width: 900px;
  padding: 16px 32px 0 32px;
  margin: auto;

  @media (min-width: 600px) {
    text-align: center;
  }

  span {
    color: rgba(0, 0, 0, 0.7);
  }
`;

export const ShareSpacer = styled.div`
  padding-right: 32px;
`;

export const ShareContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const CountySelectorWrapper = styled.div`
  margin-bottom: 2rem;
`;

export const ModelViewToggle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%; /* todo */
  border: 1px solid black;
  box-sizing: border-box;
  border-radius: 4px;
  overflow: hidden;
  margin: auto;
  margin-bottom: 2rem;
`;

export const ModelViewOption = styled.div`
  padding: 16px;
  background: ${props => (props.selected ? 'black' : 'white')};
  color: ${props => (props.selected ? 'white' : 'black')};
  font-weight: ${props => (props.selected ? 'bold' : 'normal')};
  width: 100%;
  cursor: pointer;
`;
