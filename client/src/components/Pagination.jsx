import React, { useEffect } from "react";
import { PaginationItem } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getPosts } from "../actions/posts";
import { StyledPagination } from './styles';

const Paginate = ({ page }) => {

    const { numberOfPages } = useSelector((state) => state.posts);
    const dispatch = useDispatch();

    useEffect(() => {
        if (page) {
            dispatch(getPosts(page));
        }
    }, [dispatch, page]);

    return (
        <StyledPagination
            count={numberOfPages}
            page={Number(page) || 1}
            variant="outlined"
            color="primary"
            renderItem={(item) => (
                <PaginationItem {...item} component={Link} to={`/posts?page=${item.page}`} />
            )}
        />
    )
}

export default Paginate;