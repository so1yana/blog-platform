import BlogListItem from '../blog-list-item';
// import classes from './blog-list.module.scss';

export default function BlogList({ items }) {
    const elements = items.map((el) => <BlogListItem key={el.id} item={el} />);
    return <ul>{elements}</ul>;
}
