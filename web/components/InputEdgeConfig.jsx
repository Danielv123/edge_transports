import React from "react";
import { Button, Select, Modal, InputNumber, Divider } from "antd";
import { useInstance, useInstanceConfig } from "@clusterio/web_ui";
import { InstanceSelector } from "./InstanceSelector";
import { direction_to_text } from "../util";

export function InputEdgeConfig({ fieldDefinition, value, onChange }) {
	const [visible, setVisible] = React.useState(false);
	const [newValue, setNewValue] = React.useState(value);

	const edges = newValue.edges || [];
	return <>
		<Button onClick={() => {
			setNewValue(value);
			setVisible(true);
		}}>
			Configure Edges
		</Button>
		<Modal
			title="Edge Configuration"
			open={visible}
			onOk={() => {
				onChange(JSON.stringify(newValue));
				setVisible(false);
			}}
			onCancel={() => {
				setVisible(false);
			}}
		>
			{edges.map((edge, index) => <>
				<Divider />
				<EditEdge key={index} edge={edge} onChange={(newEdge) => {
					setNewValue({
						...newValue, edges: [
							...edges.slice(0, index),
							newEdge,
							...edges.slice(index + 1),
						],
					});
				}} />
			</>)}
			{/* Button to add new edge */}
			<Button onClick={() => {
				setNewValue({
					...newValue, edges: [
						...edges,
						{},
					],
				});
			}}>
				Add Edge
			</Button>
		</Modal>
	</>;
}

function EditEdge({ edge, onChange }) {
	const leftProps = {
		style: {
			width: "30%",
			display: "inline-block",
			verticalAlign: "middle",
		},
	};
	// Fields to edit edge properties
	return <div>
		<div>
			<span {...leftProps}>Edge ID</span>
			<InputNumber
				value={edge.id}
				onChange={(value) => onChange({ ...edge, id: value })}
			/>
		</div>
		<div>
			<span {...leftProps}>Origin position</span>
			<InputNumber
				value={edge.origin?.[0]}
				formatter={(value) => `x ${value}`}
				parser={value => value.replace("x ", "")}
				onChange={(value) => onChange({ ...edge, origin: [value, edge.origin?.[1]] })}
			/>
			<InputNumber
				value={edge.origin?.[1]}
				formatter={(value) => `y ${value}`}
				parser={value => value.replace("y ", "")}
				onChange={(value) => onChange({ ...edge, origin: [edge.origin?.[0], value] })}
			/>
		</div>
		<div>
			<span {...leftProps}>Surface</span>
			<InputNumber
				value={edge.surface}
				onChange={(value) => onChange({ ...edge, surface: value })}
			/>
		</div>
		<div>
			<span {...leftProps}>Direction</span>
			<Select
				value={edge.direction}
				onChange={(value) => onChange({ ...edge, direction: value })}
				style={{ width: "auto", minWidth: "200px" }}
			>
				{[0, 2, 4, 6].map(value => <Select.Option key={value} value={value}>
					{direction_to_text(value)}
				</Select.Option>)}
			</Select>
		</div>
		<div>
			<span {...leftProps}>Length</span>
			<InputNumber
				value={edge.length}
				onChange={(value) => onChange({ ...edge, length: value })}
			/>
		</div>
		<div>
			<span {...leftProps}>Target Instance</span>
			<InstanceSelector
				selected={edge.target_instance}
				onSelect={(value) => onChange({ ...edge, target_instance: value })}
			/>
		</div>
		<div>
			<span {...leftProps}>Target Edge</span>
			<div style={{
				display: "inline-block",
				verticalAlign: "middle",
			}}>
				<InputNumber
					value={edge.target_edge}
					onChange={(value) => onChange({ ...edge, target_edge: value })}
					style={{
						width: "75px",
					}}
				/>
			</div>
			<div style={{
				display: "inline-block",
				verticalAlign: "middle",
				marginLeft: "10px",
			}}>
				<TargetEdgeInfo edge={edge} />
			</div>
		</div>
	</div>;
};

function TargetEdgeInfo({ edge }) {
	const [instance] = useInstance(edge.target_instance);
	const config = useInstanceConfig(edge.target_instance);
	const target_edge = config?.["edge_transports.internal"]?.edges?.find?.(e => e.id === edge.target_edge);
	console.log(instance, config, target_edge);

	if (!target_edge) { return ""; }

	// Visualize some information about the target edge to make it easier to pick the right one
	return <div>
		<p>Surface {target_edge.surface} at x{target_edge.origin?.[0]}, y{target_edge.origin?.[1]}</p>
		<p>Pointing {direction_to_text(target_edge.direction)}</p>
	</div>;
}
