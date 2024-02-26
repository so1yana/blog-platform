import { Skeleton } from 'antd';
import '../blog-list/blog-list-skeleton.css';

export default function ArticleSkeleton() {
    return (
        <div className="skeleton">
            <Skeleton
                title={false}
                paragraph={{
                    width: [938],
                    rows: 1,
                }}
                active
            />
        </div>
    );
}
