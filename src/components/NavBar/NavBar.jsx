import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography, Button, Box} from '@mui/material';

export const NavBar = ({ pages }) => {
    return (
        <AppBar component="nav">
            <Toolbar>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1 }}
                >
                    Dashboard
                </Typography>
                <Box>
                    {pages.map((page) => (
                        <Button key={page.title} sx={{ color: '#fff' }}>
                            {page.title}
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

NavBar.propTypes = {
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            route: PropTypes.string.isRequired,
        })
    ).isRequired,
};
