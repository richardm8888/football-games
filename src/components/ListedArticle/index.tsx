import * as React from 'react';
import { useNavigate} from "react-router-dom";
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';


export default function ({ article }: { article: any }) {
    const navigate = useNavigate();

    return (
        <Card onClick={() => navigate(`/${article.category.slug}/${article.slug}`)} style={{ width: '100%' }}>
            <CardActionArea sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <CardMedia
                    component="img"
                    sx={{ width: 151 }}
                    image={article.image.url}
                    alt={article.title}
                />
                <CardContent sx={{ display: 'flex', height: '100%', alignItems: 'center' }}>
                    <Typography variant="subtitle2" >{article.title}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
