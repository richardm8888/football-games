import * as React from 'react';
import { useParams } from 'react-router-dom';
import Page from '../../components/Page';

export default function () {
    const params = useParams();
    return <Page slug={'movie/' + params?.difficulty} />;
}
