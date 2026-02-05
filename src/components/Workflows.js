import React, { useState } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import './Workflows.css';

const Workflows = () => {
  const { t } = useLocalization();
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: 'Auto Invoice Generation',
      description: 'Automatically generate invoices when order status changes to Processing',
      trigger: 'order_status_change',
      triggerValue: 'Processing',
      actions: ['generate_invoice', 'send_email'],
      enabled: true,
      executions: 245
    },
    {
      id: 2,
      name: 'Low Stock Alert',
      description: 'Notify when product inventory falls below 10 units',
      trigger: 'inventory_level',
      triggerValue: '< 10',
      actions: ['send_notification', 'email_admin'],
      enabled: true,
      executions: 89
    },
    {
      id: 3,
      name: 'Customer Welcome Email',
      description: 'Send welcome email to new customers',
      trigger: 'new_customer',
      triggerValue: 'Any',
      actions: ['send_email'],
      enabled: true,
      executions: 156
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);

  const triggers = [
    'order_status_change',
    'inventory_level',
    'new_customer',
    'payment_received',
    'refund_requested',
    'product_added',
    'low_stock'
  ];

  const actions = [
    'send_email',
    'send_notification',
    'generate_invoice',
    'update_inventory',
    'create_task',
    'email_admin',
    'log_event'
  ];

  const handleEditWorkflow = (workflow) => {
    setEditingWorkflow(workflow);
    setShowModal(true);
  };

  const handleSaveWorkflow = (updatedWorkflow) => {
    if (editingWorkflow) {
      setWorkflows(workflows.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w));
    } else {
      setWorkflows([...workflows, { ...updatedWorkflow, id: Date.now(), executions: 0 }]);
    }
    setShowModal(false);
    setEditingWorkflow(null);
  };

  const handleToggleWorkflow = (workflowId) => {
    setWorkflows(workflows.map(w =>
      w.id === workflowId ? { ...w, enabled: !w.enabled } : w
    ));
  };

  const handleDeleteWorkflow = (workflowId) => {
    if (window.confirm(t('workflows', 'confirmDelete'))) {
      setWorkflows(workflows.filter(w => w.id !== workflowId));
    }
  };

  return (
    <div className="workflows">
      <div className="page-header">
        <h1>⚙️ {t('workflows', 'title')}</h1>
        <p>{t('workflows', 'description')}</p>
      </div>

      <div className="workflow-stats">
        <div className="stat-card">
          <h3>{workflows.length}</h3>
          <p>{t('workflows', 'totalWorkflows')}</p>
        </div>
        <div className="stat-card">
          <h3>{workflows.filter(w => w.enabled).length}</h3>
          <p>{t('workflows', 'activeWorkflows')}</p>
        </div>
        <div className="stat-card">
          <h3>{workflows.reduce((sum, w) => sum + w.executions, 0)}</h3>
          <p>{t('workflows', 'totalExecutions')}</p>
        </div>
      </div>

      <div className="workflows-header">
        <button className="btn-primary" onClick={() => {
          setEditingWorkflow(null);
          setShowModal(true);
        }}>
          + {t('workflows', 'newWorkflow')}
        </button>
      </div>

      <div className="workflows-list">
        {workflows.map((workflow) => (
          <div key={workflow.id} className={`workflow-card ${workflow.enabled ? 'enabled' : 'disabled'}`}>
            <div className="workflow-header">
              <h3>{workflow.name}</h3>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={workflow.enabled}
                  onChange={() => handleToggleWorkflow(workflow.id)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <p className="workflow-description">{workflow.description}</p>

            <div className="workflow-details">
              <div className="detail-item">
                <span className="label">{t('workflows', 'trigger')}:</span>
                <span className="value">{workflow.trigger} = {workflow.triggerValue}</span>
              </div>
              <div className="detail-item">
                <span className="label">{t('workflows', 'actions')}:</span>
                <div className="actions-list">
                  {workflow.actions.map((action) => (
                    <span key={action} className="action-badge">{action}</span>
                  ))}
                </div>
              </div>
              <div className="detail-item">
                <span className="label">{t('workflows', 'executions')}:</span>
                <span className="value">{workflow.executions}</span>
              </div>
            </div>

            <div className="workflow-actions">
              <button className="btn-small" onClick={() => handleEditWorkflow(workflow)}>{t('common', 'edit')}</button>
              <button className="btn-small danger" onClick={() => handleDeleteWorkflow(workflow.id)}>{t('common', 'delete')}</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingWorkflow ? t('common', 'edit') : t('workflows', 'newWorkflow')}</h3>
            <WorkflowForm
              workflow={editingWorkflow}
              triggers={triggers}
              actions={actions}
              onSave={handleSaveWorkflow}
              onCancel={() => setShowModal(false)}
              t={t}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const WorkflowForm = ({ workflow, triggers, actions, onSave, onCancel, t }) => {
  const [formData, setFormData] = useState(
    workflow || {
      name: '',
      description: '',
      trigger: 'order_status_change',
      triggerValue: '',
      actions: []
    }
  );

  const handleActionToggle = (action) => {
    setFormData({
      ...formData,
      actions: formData.actions.includes(action)
        ? formData.actions.filter(a => a !== action)
        : [...formData.actions, action]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="workflow-form">
      <div className="form-group">
        <label>{t('common', 'name')}</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>{t('common', 'description')}</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>{t('workflows', 'trigger')}</label>
        <select
          value={formData.trigger}
          onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
        >
          {triggers.map((trigger) => (
            <option key={trigger} value={trigger}>{trigger}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>{t('workflows', 'triggerValue')}</label>
        <input
          type="text"
          value={formData.triggerValue}
          onChange={(e) => setFormData({ ...formData, triggerValue: e.target.value })}
          placeholder="e.g., Processing, < 10"
        />
      </div>

      <div className="form-group">
        <label>{t('workflows', 'actions')}</label>
        <div className="actions-checkboxes">
          {actions.map((action) => (
            <label key={action} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.actions.includes(action)}
                onChange={() => handleActionToggle(action)}
              />
              {action}
            </label>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">{t('common', 'save')}</button>
        <button type="button" className="btn-secondary" onClick={onCancel}>{t('common', 'cancel')}</button>
      </div>
    </form>
  );
};

export default Workflows;
