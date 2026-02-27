import { ThemeWrapper } from '../components/ThemeWrapper';
import { Container, Box } from '@mui/material';
import App from './App';

function Main() {
  return (
    <Container maxWidth={false} sx={{ p: 0 }}>
      <ThemeWrapper>
        <App />
      </ThemeWrapper>
    </Container>
  );
}

export default Main;
