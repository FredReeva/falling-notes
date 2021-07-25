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
    
    margin-top:5px;
    font-size: 200%;

  }

  .CloseBtn{
    transition: 0.3s;  
    justify-content: center;
    align-items: center;
    font-size: 200%;
    
    cursor: pointer;
    outline: none;

    color: rgba(255,0,0, 0.55);

    &:hover {
        transition: 0.5s;  
        color: rgba(255,0,0, 0.9);
    }
  }

  h2 {
    
    display: block;
    font-size: 1.4em;
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
  justify-content: center;
  align-items: center;
  //font-size: 1em;
  height: 30px;
  width: fit-content;
  min-width: 50px;
  border-radius: 10px;
  margin-right: 5px;
  margin-top: 7px;
  padding: 7px;
}

form{
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
}

p{
  font-size: 1.1em;
}

.Container{
  position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.ColorButton{
  text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;
}

  `;
