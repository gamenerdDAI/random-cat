import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

// getServerSidePropsから渡されるpropsの型
type Props = {
    initialImageUrl: string;
};

const IndexPage: NextPage<Props> = ({ initialImageUrl }) => { // JSのアロー関数を参照
    const [imageUrl, setImageUrl] = useState(initialImageUrl);
    const [loading, setLoading] = useState(false);
    // // マウント時に画像を読み込む宣言
    // useEffect(() => {
    //     fetchImage().then((newImage) => {
    //         setImageUrl(newImage.url); // 画像URLの状態を更新する
    //         setLoading(false); // ローディング状態を更新する
    //     });
    // }, []);
    // ボタンをクリックしたときに画像を読み込む処理
    const handleClick = async () => {
        setLoading(true); // 読込中フラグを立てる
        const newImage = await fetchImage();
        setImageUrl(newImage.url);
        setLoading(false);
    };
    return (
        <div className={styles.page}>
            <button onClick={handleClick} className={styles.button}>他のにゃんこも見る</button>
            <div className={styles.frame}>{loading || <img src={imageUrl} className={styles.img} />}</div>
        </div>
    );
};
export default IndexPage;

// サーバサイドで実行する処理
export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const image = await fetchImage();
    return {
        props: {
            initialImageUrl: image.url,
        },
    };
};

type Image = {
    url: string;
};

const fetchImage = async (): Promise<Image> => {
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    const images: unknown = await res.json();
    if (!Array.isArray(images)) {
        throw new Error("猫の画像が取得できませんでした");
    }
    const image: unknown = images[0];
    console.log(images);
    return images[0];
};

// 型ガード関数
const isImage = (value: unknown): value is Image => {
    // 値がオブジェクトなのか？
    if (!value || typeof value !== "object") {
        return false;
    }

    // urlプロパティが存在し、かつそれが文字列なのか？
    return "url" in value && typeof value.url === "string";
};

fetchImage().then((image) => {
    console.log(image.url);
});