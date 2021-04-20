import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin:0;
    padding: 0;
    box-sizing: border-box;

    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
        'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
        'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    user-select: none;
    border: none;
    outline: none;

  }

  .Icon{
    
    
    justify-content: center;
    align-items: center;
    font-size: 200%;

  }

  .CloseBtn{
    transition: 0.3s;  
    justify-content: center;
    align-items: center;
    font-size: 150%;
    
    cursor: pointer;
    outline: none;

    color: rgba(255,0,0, 0.3);

    &:hover {
        transition: 0.5s;  
        color: rgba(255,0,0, 0.8);
    }
  }

  h2 {
    
    display: block;
    font-size: 0.8em;
    margin-top: 0;
    margin-bottom: 0;
    margin-left: 0;
    margin-right: 0;
    font-weight: bold;
    
  }

  h3 {
    margin: 0;
    position: absolute;
    display: block;
    font-size: 1em;
    font-weight: bold;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

  }

input{
  width: 50px;
}

  `;
