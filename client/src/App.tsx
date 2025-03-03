import { StyledEngineProvider } from '@mui/material/styles';
import './App.css';
import SimpleContainer from './components/SimpleContainer';

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <SimpleContainer />
    </StyledEngineProvider>
  )
}

export default App
