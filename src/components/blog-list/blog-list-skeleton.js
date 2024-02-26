import { Skeleton } from 'antd';
import './blog-list-skeleton.css';

export default function BlogListSkeleton() {
    return (
        <div className="skeleton">
            <Skeleton
                title={false}
                paragraph={{
                    width: [938, 938, 938, 938, 938],
                    rows: 5,
                    style: {},
                }}
                active
            />
        </div>
    );
}
