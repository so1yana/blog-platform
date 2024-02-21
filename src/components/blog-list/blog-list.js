import { Pagination } from 'antd';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import articles from '../../actions/api';
import BlogListItem from '../blog-list-item';
// import classes from './blog-list.module.scss';

function BlogList({ items, amount, page, ac }) {
    let elements = [];
    useEffect(() => {
        ac(page * 5 - 5, page);
    }, []);
    if (items.length > 0)
        elements = items.map((el) => (
            <BlogListItem
                key={`${el.slug}${(Math.random() + 15) * (Math.random() + 15) * 123}`}
                item={el}
            />
        ));
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '16px',
                marginTop: '96px',
            }}
        >
            <ul>{elements}</ul>
            <Pagination
                defaultCurrent={page}
                total={amount}
                pageSize={5}
                onChange={(p) => ac(p * 5 - 5, p)}
                showSizeChanger={false}
            />
        </div>
    );
}

const mapStateToProps = (state) => {
    return { items: state.articles, amount: state.amount, page: state.page };
};

export default connect(mapStateToProps, { ac: articles })(BlogList);
