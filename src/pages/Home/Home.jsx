import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

export const Home = ({pages}) => (
    <Box>
        <h1>Welcome to Dashboard!</h1>
        {pages.map((page) => (
            <Link 
            key={page.title} 
            to={page.route} 
            style={{ textDecoration: 'none' }}
            >
            <h2>Go to {page.title}</h2>
            </Link>
        ))}
    </Box>
);

Home.propTypes = {
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            route: PropTypes.string.isRequired,
        })
    ).isRequired,
};