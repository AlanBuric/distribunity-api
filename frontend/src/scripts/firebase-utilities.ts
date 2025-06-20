import { database } from '@/firebase/init';
import type { Organization, WithId } from '@/types';
import axios from 'axios';
import {
  writeBatch,
  collection,
  getDocs,
  doc,
  runTransaction,
  arrayRemove,
} from 'firebase/firestore';

export function firestoreAutoId(): string {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let autoId = '';

  for (let i = 0; i < 20; i++) {
    autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return autoId;
}

export async function deleteInventoryRecursively(organizationId: string, inventoryId: string) {
  const batch = writeBatch(database);

  const itemsRef = collection(
    database,
    'organizations',
    organizationId,
    'inventories',
    inventoryId,
    'items',
  );
  const itemsSnapshot = await getDocs(itemsRef);

  itemsSnapshot.forEach((itemDoc) => {
    const itemDocRef = doc(
      database,
      'organizations',
      organizationId,
      'inventories',
      inventoryId,
      'items',
      itemDoc.id,
    );
    batch.delete(itemDocRef);
  });

  batch.delete(doc(database, 'organizations', organizationId, 'inventories', inventoryId));

  await batch.commit();
}

export async function deleteOrganization(
  organizationId: string | number,
  organizationName: string,
) {
  if (
    !confirm(
      `Are you sure you want to delete the organization ${organizationName}? This action is irreversible.`,
    )
  )
    return;

  await axios.delete(`/api/organizations/${organizationId}`).catch((error) => {
    console.error('An error was caught while trying to delete an organization', error);
    alert(
      `Sorry, we were unable to delete the organization ${organizationName}. Please contact us to resolve this issue.`,
    );
  });
}
