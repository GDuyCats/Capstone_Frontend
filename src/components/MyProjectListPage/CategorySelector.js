import React, { useState, useEffect } from "react";
import { Button, Select, Tag, Modal, List, message } from "antd";
import {
  fetchAllCategories,
  addCategoryToProject,
  fetchProjectCategories,
  removeCategoryFromProject,
} from "../../api/apiClient";

const { Option } = Select;

const CategorySelector = ({ projectId }) => {
  const [allCategories, setAllCategories] = useState([]);
  const [projectCategories, setProjectCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadCategories();
    loadProjectCategories();
  }, [projectId]);

  const loadCategories = async () => {
    try {
      const response = await fetchAllCategories();
      setAllCategories(response.data.data || []);
    } catch (error) {
      message.error("Failed to load categories");
    }
  };

  const loadProjectCategories = async () => {
    try {
      const response = await fetchProjectCategories(projectId);
      setProjectCategories(response.data.data || []);
    } catch (error) {
      message.error("Failed to load project categories");
    }
  };

  const handleAddCategory = async () => {
    if (!selectedCategory) return;

    try {
      setLoading(true);
      await addCategoryToProject(projectId, selectedCategory);
      message.success("Category added successfully");
      loadProjectCategories();
      setSelectedCategory(null);
    } catch (error) {
      message.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCategory = async (categoryId) => {
    try {
      await removeCategoryFromProject(projectId, categoryId);
      message.success("Category removed successfully");
      loadProjectCategories();
    } catch (error) {
      message.error("Failed to remove category");
    }
  };

  return (
    <div>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        Manage Categories
      </Button>

      <Modal
        title="Project Categories"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <div style={{ marginBottom: 16 }}>
          <Select
            style={{ width: "60%", marginRight: 8 }}
            placeholder="Select a category"
            value={selectedCategory}
            onChange={setSelectedCategory}
          >
            {allCategories
              .filter(
                (cat) =>
                  !projectCategories.some(
                    (pc) => pc["category-id"] === cat["category-id"]
                  )
              )
              .map((category) => (
                <Option
                  key={category["category-id"]}
                  value={category["category-id"]}
                >
                  {category.name}
                </Option>
              ))}
          </Select>
          <Button
            type="primary"
            onClick={handleAddCategory}
            loading={loading}
            disabled={!selectedCategory}
          >
            Add Category
          </Button>
        </div>

        <List
          header={<div>Current Categories</div>}
          bordered
          dataSource={projectCategories}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  danger
                  size="small"
                  onClick={() => handleRemoveCategory(item["category-id"])}
                >
                  Remove
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={item.name}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Modal>

      <div style={{ marginTop: 8 }}>
        {projectCategories.map((category) => (
          <Tag key={category["category-id"]} color="blue">
            {category.name}
          </Tag>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
