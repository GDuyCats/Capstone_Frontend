import React from "react";
import { Descriptions, Avatar, Typography, Card, Divider } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const CreatorProfile = ({ creator }) => {
  if (!creator) return null;

  return (
    <Card>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Avatar
          size={128}
          src={creator.avatar}
          icon={<UserOutlined />}
          style={{ backgroundColor: "#1890ff", marginBottom: 16 }}
        />
        <Title level={3}>{creator["full-name"]}</Title>
        {creator.bio && (
          <Paragraph style={{ maxWidth: 600, margin: "0 auto" }}>
            {creator.bio}
          </Paragraph>
        )}
      </div>

      <Divider orientation="left">Creator Information</Divider>

      <Descriptions bordered column={1}>
        <Descriptions.Item
          label={
            <>
              <MailOutlined /> Email
            </>
          }
        >
          {creator.email || "Not provided"}
        </Descriptions.Item>
        {creator.phone && (
          <Descriptions.Item
            label={
              <>
                <PhoneOutlined /> Phone
              </>
            }
          >
            {creator.phone}
          </Descriptions.Item>
        )}
        <Descriptions.Item
          label={
            <>
              <CalendarOutlined /> Member since
            </>
          }
        >
          {new Date(creator["created-datetime"]).toLocaleDateString()}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default CreatorProfile;
