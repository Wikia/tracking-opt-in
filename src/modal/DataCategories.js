import {Component, h} from 'preact';
import styles from "./DataCategories.scss";
import FindOutMoreLink from "./FindOutMoreLink";

class DataCategories extends Component {
    state = {
        dataCategories: []
    }

    componentWillMount() {
        this.state.dataCategories = this.props.dataCategories.filter((category) => {
            return this.props.vendor.dataDeclaration.includes(category.id);
        })
    }

    render({content, vendor}, state) {
        const { dataCategories } = state;
        return (<div>
                <div>
                    <div className={styles.subheader}>
                        {content.dataCategoriesHeading}
                    </div>
                    <div>
                        {dataCategories.map((category) => {
                            return (<div className={styles.dataCategory}>
                                <div className={styles.flex}>
                                    <span>{category.name}</span>
                                    <FindOutMoreLink vendor={vendor} content={content} />
                                </div>
                                <div className={styles.dataCategoryDetails}>{category.description}</div>
                            </div>)
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default DataCategories;
